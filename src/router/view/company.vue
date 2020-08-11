<script>
import Layout from "../layouts/main";
import CompanyProfile from "@/components/widgets/company-profile";
import api from "@/api";

export default {
  components: {
    Layout,
    CompanyProfile,
  },
  mounted() {
    this.id = this.$route.query.id;
    this.fetch();
  },
  methods: {
    async fetch() {
      this.isLoading = true;
      const { data } = await api.companies(this.id);
      this.company = data.company;
      this.locations = data.locations;
      this.owners = data.owners;
      this.visitors = data.visitors;
      this.isLoading = false;
    },
    hadIssues(visitor) {
      Object.keys(visitor).forEach((item) => {
        if (visitor[item] === "YES") {
          return "Had symptomps.";
        }
      });
      return "No symptoms.";
    },
  },
  data() {
    return {
      id: null,
      isLoading: false,
      company: null,
      locations: [],
      owners: [],
      visitors: [],
    };
  },
};
</script>

<template>
  <Layout>
    <div class="card-body text-center" v-if="isLoading">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-xl-6">
          <CompanyProfile :profile="company" />
          <div class="card my-4">
            <div class="card-body">
              <h4 class="card-title mb-5">Owners</h4>
              <ul class="verti-timeline list-unstyled" v-if="locations.length > 0">
                <li class="event-list" v-for="owner in owners" :key="owner.owner_id">
                  <div class="media">
                    <div class="media-body">
                      <div>{{owner.owner_firstname}} {{owner.owner_lastname}}</div>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else class="text text-center">No data.</div>
            </div>
          </div>
        </div>
        <!-- end col -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-5">Locations</h4>
              <ul class="verti-timeline list-unstyled" v-if="locations.length > 0">
                <li class="event-list" v-for="location in locations" :key="location.locationId">
                  <div class="event-timeline-dot">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="media">
                    <div class="media-body">
                      <div>{{location.description}}</div>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else class="text text-center">No data.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-5">Visitors</h4>
              <ul class="verti-timeline list-unstyled" v-if="visitors.length > 0">
                <li class="event-list" v-for="visitor in visitors" :key="visitor.id">
                  <div class="event-timeline-dot">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="media">
                    <div class="mr-3">
                      <h5 class="font-size-14">
                        {{visitor.name}} - {{visitor.jobTitle}} - {{visitor.identityNo}}
                        <i
                          class="bx bx-right-arrow-alt font-size-16 text-primary align-middle ml-2"
                        ></i>
                      </h5>
                    </div>
                    <div class="media-body">
                      <div>{{hadIssues(visitor)}}</div>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else class="text text-center">No data.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
