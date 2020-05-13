import {
    Component,
    OnInit,
    ViewChild,
    HostBinding,
    Input,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { IonReorderGroup, NavController } from '@ionic/angular';
import {
    UserNotificationSetting,
    NotificationType,
} from '../user-notification-settings/user-notification-settings.component';
import { BelAQIService } from '../../services/bel-aqi.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    // todo: move animation to screen transitions
    animations: [
        trigger('menuAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateX(-100%)' }),
                animate(
                    '300ms',
                    style({ opacity: 1, transform: 'translateX(0)' })
                ),
            ]),
            transition(':leave', [
                animate(
                    '300ms',
                    style({ opacity: 0, transform: 'translateX(-100%)' })
                ),
            ]),
        ]),
    ],
})
export class HeaderComponent implements OnInit {
    @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

    @HostBinding('style.background-color')
    public backgroundColor;

    @Input()
    set belAqi(index: number) {
        this.backgroundColor = this.getBackgroundForIndex(index);
    }

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService
    ) {
        belAQIService.$activeIndex.subscribe( ( newIndex ) => {
            this.belAqi = newIndex.indexScore;
        });
    }

    ngOnInit() {}

    getBackgroundForIndex(index: number) {
        this.belAQIService.getLightColorForIndex(index);
    }

    openMenu() {
        // todo: fix animation for this
        this.navCtrl.navigateForward(['main/menu'], { animated: true });
    }

    openRating() {
        this.navCtrl.navigateForward(['main/rating'], { animated: false });
    }
}
