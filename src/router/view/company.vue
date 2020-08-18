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
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
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
      let hadSymptom = false;
      Object.keys(visitor).forEach((item) => {
        if (visitor[item] === "Yes") {
          hadSymptom = true;
        }
      });
      return hadSymptom;
    },
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.visitors.length;
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
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "name",
      sortDesc: false,
      fields: [
        { key: "name", sortable: true },
        { key: "jobTitle", sortable: true },
        { key: "identityNo", sortable: true },
        { key: "phoneNo", sortable: true },
        { key: "temperature", sortable: true },
        { key: "dateCreated", sortable: true },
        { key: "issues", sortable: true },
      ],
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
        </div>
        <div class="col-xl-6">
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
      </div>
      <div class="row my-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body text-center" v-if="isLoading">
              <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
            </div>
            <div class="card-body" v-else>
              <h4 class="card-title">Visitors</h4>
              <div class="row mt-4">
                <div class="col-sm-12 col-md-6">
                  <div id="tickets-table_length" class="dataTables_length">
                    <label class="d-inline-flex align-items-center">
                      <span class="mr-1">Show</span>
                      <b-form-select
                        class="mr-1"
                        v-model="perPage"
                        size="sm"
                        :options="pageOptions"
                      ></b-form-select>entries
                    </label>
                  </div>
                </div>
                <!-- Search -->
                <div class="col-sm-12 col-md-6">
                  <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                    <label class="d-inline-flex align-items-center">
                      Search:
                      <b-form-input
                        v-model="filter"
                        type="search"
                        placeholder="Search..."
                        class="form-control form-control-sm ml-2"
                      ></b-form-input>
                    </label>
                  </div>
                </div>
                <!-- End search -->
              </div>
              <!-- Table -->
              <div class="table-responsive mb-0">
                <b-table
                  :items="visitors"
                  :fields="fields"
                  responsive="sm"
                  :per-page="perPage"
                  :current-page="currentPage"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  @filtered="onFiltered"
                >
                  <template v-slot:cell(issues)="row">
                    <span
                      v-if="hadIssues(row.item)"
                      class="badge badge-pill badge-danger font-size-12 mr-1"
                    >
                      One or more sympotoms.
                      <i class="bx bx-sad" />
                    </span>
                    <span v-else class="badge badge-pill badge-success font-size-12 mr-1">
                      No symptoms.
                      <i class="bx bx-happy" />
                    </span>
                  </template>
                </b-table>
              </div>
              <div class="row">
                <div class="col">
                  <div class="dataTables_paginate paging_simple_numbers float-right">
                    <ul class="pagination pagination-rounded mb-0">
                      <!-- pagination -->
                      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row my-4">
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
    </div>
  </Layout>
</template>
