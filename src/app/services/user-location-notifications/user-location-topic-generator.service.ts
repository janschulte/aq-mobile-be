import { Injectable } from '@angular/core';

import { LocationSubscription } from './user-location-notifications.service';

export const USER_LOCATION_NOTIFICATION_TOPIC_PREFIX = 'fcm';

@Injectable({
  providedIn: 'root'
})
export class UserLocationTopicGeneratorService {

  public generateTopic(subscr: LocationSubscription): string {
    return `${USER_LOCATION_NOTIFICATION_TOPIC_PREFIX}_${subscr.lat}_${subscr.lng}_${subscr.language}`;
  }

  public isUserLocationTopic(topic: string): boolean {
    return topic.startsWith(USER_LOCATION_NOTIFICATION_TOPIC_PREFIX);
  }

  public generateLatLngOfTopic(topic: string) {
    const topicSplit = topic.split('_');
    if (topicSplit[0] === USER_LOCATION_NOTIFICATION_TOPIC_PREFIX && topicSplit[1] && topicSplit[2]) {
      const lat = parseFloat(topicSplit[1]);
      const lng = parseFloat(topicSplit[2]);
      return {
        lat: lat,
        lng: lng
      };
    }
  }
}
