import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { NzTagModule, NzButtonModule, NzCardModule, NzAvatarModule, NzRateModule, NzBadgeModule, NzProgressModule, NzRadioModule, NzTableModule, NzDropDownModule, NzTimelineModule, NzTabsModule, NzDividerModule, NzListModule, NzCalendarModule, NzToolTipModule, NzFormModule, NzModalModule, NzSelectModule, NzUploadModule, NzInputModule, NzPaginationModule, NzDatePickerModule, NzCheckboxModule, NzMessageModule, NzIconModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';

const antdModule = [
  NzButtonModule,
  NzCardModule,
  NzAvatarModule,
  NzRateModule,
  NzBadgeModule,
  NzProgressModule,
  NzRadioModule,
  NzTableModule,
  NzDropDownModule,
  NzIconModule,
  NzTimelineModule,
  NzTabsModule,
  NzDividerModule,
  NzTagModule,
  NzListModule,
  NzCalendarModule,
  NzToolTipModule,
  NzFormModule,
  NzModalModule,
  NzSelectModule,
  NzUploadModule,
  NzInputModule,
  NzPaginationModule,
  NzDatePickerModule,
  NzCheckboxModule,
  NzMessageModule,
  NzRateModule
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    ...antdModule
  ]
})
export class ProfileModule { }
