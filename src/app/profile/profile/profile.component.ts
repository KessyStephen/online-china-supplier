import { Component, OnInit } from '@angular/core'
import { ProfileService } from 'src/app/shared/services/profile.service';
import { Profile } from 'src/app/shared/interfaces/profile.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {

  profile: Profile;
  isEdit: boolean = false;
  profileDetailsForm: FormGroup = this.fb.group({
    businessLicense: [null, [Validators.required]],
    companyName: [null, [Validators.required]],
    companyAddress: [null, [Validators.required]],
    bankName: [null, [Validators.required]],
    bankAccountNumber: [null, [Validators.required]],
    swiftCode: [null, [Validators.required]],
    postCode: [null, [Validators.required]],
  });;
  constructor(private profileService: ProfileService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.profileDetailsForm.disable();
    this.profileService.getProfile().subscribe((result: Profile) => {
      this.profile = result;
      this.profileDetailsForm = this.fb.group({
        businessLicense: [this.profile.businessLicense, [Validators.required]],
        companyName: [this.profile.companyName, [Validators.required]],
        companyAddress: [this.profile.companyAddress, [Validators.required]],
        bankName: [this.profile.bankName, [Validators.required]],
        bankAccountNumber: [this.profile.bankAccountNumber, [Validators.required]],
        swiftCode: [this.profile.swiftCode, [Validators.required]],
        postCode: [this.profile.postCode, [Validators.required]],
      });
    });
  }


  edit() {
    this.isEdit = !this.isEdit;
    if (this.isEdit)
      this.profileDetailsForm.enable();
    else
      this.profileDetailsForm.disable()
  }

  save() {
    this.profileService.updateProfile(this.profileDetailsForm.value).subscribe((result: boolean) => {
      if (result)
        this.profileDetailsForm.disable();
    })
  }

}    