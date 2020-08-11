<script>
/**
 * Profile component
 */
export default {
  props: {
    profile: {
      reqiored: true
    }
  }
};
</script>
<template>
  <div class="card overflow-hidden">
    <div class="bg-soft-primary">
      <div class="row">
        <div class="col-7">
          <div class="text-primary p-3">
            <h5 class="text-primary">Company Profile</h5>
          </div>
        </div>
        <div class="col-5 align-self-end">
          <img src="@/assets/images/profile-img.png" alt class="img-fluid" />
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="row mt-2">
        <div class="col-sm-12">
          <h5 class="font-size-15 text-truncate">{{ profile.company_name }}</h5>
          <p class="text-muted mb-0 text-truncate">{{ profile.company_email }}</p>
          <p class="text-muted mb-0 text-truncate">{{ profile.company_address }}</p>
          <p class="text-muted mb-0 text-truncate">{{ profile.company_vat }}</p>
        </div>
      </div>
    </div>
    <!-- end card-body -->
  </div>
  <!-- end card -->
</template>