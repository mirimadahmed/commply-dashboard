<script>
import Layout from "../layouts/main";
import api from "@/api";
import { mapState } from "vuex";

export default {
  components: {
    Layout,
  },
  data() {
    return {
      isLoading: false,
      declarations: 0,
      totalDeclarations: 0,
      totalDailyChecks: 0,
      totalVisitors: 0,
      totalRisks: 0,
      openRisks: 0,
    };
  },
  computed: {
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
  },
  mounted() {
      this.fetch();
  },
  methods: {
      async fetch() {
          this.isLoading = true;
          let company_id = this.user.company_id ? this.user.company_id : null;
          const { data } = await api.homestats({
              is_owner: this.user.is_owner,
              company_id
          });
          this.declarations = data.declarations;
          this.totalDeclarations = data.totalDeclarations;
          this.totalDailyChecks = data.totalDailyChecks;
          this.totalVisitors = data.totalVisitors;
          this.totalRisks = data.totalRisks;
          this.openRisks = data.openRisks;
          this.isLoading = false;
      }
  }
};
</script>

<template>
  <Layout>
    <div v-if="isLoading" class="w-100 text-center">
        <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="mb-0 font-size-18">Home</h4>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="media text-center">
                <div class="media-body">
                  <p class="text-muted font-weight-medium">Employee Declarations</p>
                  <h4 class="mb-0 text-primary">{{ declarations }} / {{ totalDeclarations }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="media text-center">
                <div class="media-body">
                  <p class="text-muted font-weight-medium">No of daily checks done</p>
                  <h4 class="mb-0 text-danger">{{ totalDailyChecks }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="media text-center">
                <div class="media-body">
                  <p class="text-muted font-weight-medium">Total visitors</p>
                  <h4 class="mb-0 text-success">{{ totalVisitors }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="media text-center">
                <div class="media-body">
                  <p class="text-muted font-weight-medium">Open Risk Assesments</p>
                  <h4 class="mb-0 text-warning">{{ openRisks }} / {{ totalRisks }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row my-4">
        <div class="col-4">
          <div class="card">
            <div class="card-body text-center">
              <router-link tag="a" to="/employee-dashboard" class="text-center">
                <i class="bx bxs-user-detail my-4 text-primary" style="font-size: 36px;"></i>
                <p class="font-weight-bold text-muted font-size-18">Employee Dashboard</p>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-body text-center">
              <router-link tag="a" to="/visitor-dashboard" class="text-center">
                <i class="fas fa-person-booth my-4 text-danger" style="font-size: 36px;"></i>
                <p class="font-weight-bold text-muted font-size-18">Visitor Dashboard</p>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card">
            <div class="card-body text-center">
              <router-link tag="a" to="/risk-dashboard" class="text-center">
                <i class="fas fa-diagnoses my-4 text-success" style="font-size: 36px;"></i>
                <p class="font-weight-bold text-muted font-size-18">Risk Dashboard</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
