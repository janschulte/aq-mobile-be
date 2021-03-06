import { EventEmitter, Injectable } from '@angular/core';
import { GeoSearch } from '@helgoland/map';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { Observable, Observer } from 'rxjs';

import { GeoLabelsService } from '../geo-labels/geo-labels.service';
import { LocateService, LocationStatus } from '../locate/locate.service';

export interface UserLocation {
  id?: number;
  label?: string;
  type: 'user' | 'current';
  isCurrentVisible?: boolean;
  date?: Date;
  longitude?: number;
  latitude?: number;
}

const STORAGE_USER_LOCATIONS_KEY = 'userlocation';

@Injectable()
export class UserLocationListService {

  private userLocations: UserLocation[];

  public phenomenonIDs = ['391', '8', '7', '5', '6001'];

  public locationsChanged: EventEmitter<void> = new EventEmitter();

  constructor(
    protected storage: Storage,
    private geoSearch: GeoSearch,
    protected translateSrvc: TranslateService,
    private locate: LocateService,
    private geolabels: GeoLabelsService
  ) {
    this.loadLocations().subscribe(locations => {
      this.userLocations = locations || [{ type: 'current', isCurrentVisible: false }];
      this.locationsChanged.emit();
    });
  }

  public addUserLocation(label: string, point: Point) {
    const location = {
      label: label,
      latitude: point.coordinates[1],
      longitude: point.coordinates[0],
      type: 'user',
      id: new Date().getTime(),
      nearestSeries: {}
    } as UserLocation;
    this.userLocations.push(location);
    this.storeLocations();
  }

  public determineCurrentLocation(): Observable<UserLocation> {
    return new Observable((observer: Observer<UserLocation>) => {
      this.locate.getUserLocation().subscribe(
        (pos: Geoposition) => {
          let reverseObs = this.geoSearch.reverse(
            { type: 'Point', coordinates: [pos.coords.latitude, pos.coords.longitude] },
            { acceptLanguage: this.translateSrvc.currentLang }
          );

          console.dir(reverseObs);
          reverseObs.subscribe(
            value => {
              console.dir(value);
              const locationLabel = this.geolabels.createLabelOfReverseResult(value);
              observer.next({
                id: 1,
                label: locationLabel,
                type: 'current',
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              });
              observer.complete();
            },
            error => {
              observer.error(error);
              observer.complete();
            });
        },
        error => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  public hasLocation(label: string, point: Point): boolean {
    return this.userLocations.findIndex(
      e => e.label === label
        && e.longitude === point.coordinates[0]
        && e.latitude === point.coordinates[1]
    ) > -1;
  }

  public getUserLocations(): UserLocation[] {
    return this.userLocations;
  }

  public getVisibleUserLocations(): UserLocation[] {
    return this.userLocations.filter(e => (e.type === 'current' && e.isCurrentVisible) || e.type === 'user');
  }

  public getLocationListLength(): number {
    return this.userLocations.filter(e => e.type === 'user').length;
  }

  public getLocationStatus(): LocationStatus {
    return this.locate.getLocationStatus();
  }

  public isCurrentLocationVisible(): boolean {
    const current = this.userLocations.find(e => e.type === 'current');
    return current.isCurrentVisible;
  }

  public setCurrentLocationVisisble(visible: boolean) {
    const current = this.userLocations.find(e => e.type === 'current');
    current.isCurrentVisible = visible;
    this.storeLocations();
  }

  public setUserLocations(locs: UserLocation[]) {
    this.userLocations = locs;
    this.storeLocations();
  }

  public setLocationList(locations: UserLocation[]) {
    this.userLocations = locations;
    this.storeLocations();
  }

  public removeLocation(userLocation: UserLocation) {
    this.userLocations = this.userLocations.filter(res => res.id !== userLocation.id);
    this.storeLocations();
  }

  public hasLocations(): boolean {
    return this.userLocations && this.userLocations.length > 0;
  }

  public saveLocation(userLocation: UserLocation) {
    const index = this.userLocations.findIndex(res => res.id === userLocation.id);
    this.userLocations[index] = userLocation;
    this.storeLocations();
  }

  private storeLocations() {
    this.locationsChanged.emit();
    this.storage.set(STORAGE_USER_LOCATIONS_KEY, this.userLocations);
  }

  private loadLocations(): Observable<UserLocation[]> {
    return new Observable<UserLocation[]>((observer: Observer<UserLocation[]>) => {
      this.storage.get(STORAGE_USER_LOCATIONS_KEY).then(res => {
        if (res instanceof Array) {
          observer.next(res);
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }
}
