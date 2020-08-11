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
            <h5 class="text-primary">Employee Profile</h5>
          </div>
        </div>
        <div class="col-5 align-self-end">
          <img src="@/assets/images/profile-img.png" alt class="img-fluid" />
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="row">
        <div class="col-sm-4">
          <div class="avatar-md profile-user-wid mb-4">
            <img src="@/assets/images/users/avatar-1.jpg" alt class="img-thumbnail rounded-circle" />
          </div>
          <h5 class="font-size-15 text-truncate">{{ profile.employee_firstname }}</h5>
          <p class="text-muted mb-0 text-truncate">{{ profile.employee_job }}</p>
        </div>
      </div>
    </div>
    <!-- end card-body -->
  </div>
  <!-- end card -->
</template>