<script>
import Layout from "../layouts/main";
import CompanyProfile from "@/components/widgets/company-profile";
import api from "@/api";
import { mapState } from "vuex";

export default {
  components: {
    Layout,
    CompanyProfile,
  },
  mounted() {
    this.id = this.$route.query.id;
    if (this.user.is_owner === "true") {
      this.id = this.user.company_id;
    }
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
    editCompany() {
      this.editedCompany = JSON.parse(JSON.stringify(this.company));
    },
    async saveCompany() {
      this.isLoading = true;
      const { data } = await api.updateCompany(this.editedCompany);
      this.company = JSON.parse(JSON.stringify(this.editedCompany));
      this.isLoading = false;
    },
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.visitors.length;
    },
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      editedCompany: {},
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
      <div class="row mb-4" v-if="company">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <div class="media">
                    <div class="media-body align-self-center">
                      <div class="text-muted">
                        <p class="mb-2">Welcome to Commply dashboard</p>
                        <h5 class="mb-1">{{ company.company_name }}</h5>
                        <p class="mb-0">{{ company.company_address }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col align-self-center text-right">
                  <b-button variant="primary" @click="editCompany" v-b-modal.modal-standard>
                    <i class="bx bx-pencil align-middle mr-1"></i> Edit
                  </b-button>
                </div>
              </div>
              <!-- end row -->
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-lg-4 align-self-center">
              <div class="card mini-stats-wid">
                <div class="card-body">
                  <div class="media">
                    <div class="media-body">
                      <p class="text-muted font-weight-medium">Total Visitors</p>
                      <h4 class="mb-0">{{visitors.length}}</h4>
                    </div>

                    <div
                      class="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary"
                    >
                      <span class="avatar-title">
                        <i class="bx bx-user-pin font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- end card-body -->
              </div>
            </div>
            <div class="col-lg-4 align-self-center">
              <div class="card mini-stats-wid">
                <div class="card-body">
                  <div class="media">
                    <div class="media-body">
                      <p class="text-muted font-weight-medium">Total Locations</p>
                      <h4 class="mb-0">{{locations.length}}</h4>
                    </div>

                    <div
                      class="mini-stat-icon avatar-sm align-self-center rounded-circle bg-danger"
                    >
                      <span class="avatar-title bg-secondary">
                        <i class="bx bx-map-pin font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- end card-body -->
              </div>
            </div>
            <div class="col-lg-4 align-self-center">
              <div class="card mini-stats-wid">
                <div class="card-body">
                  <div class="media">
                    <div class="media-body">
                      <p class="text-muted font-weight-medium">Total Owners</p>
                      <h4 class="mb-0">{{owners.length}}</h4>
                    </div>

                    <div
                      class="mini-stat-icon avatar-sm align-self-center rounded-circle "
                    >
                      <span class="avatar-title bg-success">
                        <i class="bx bx-crown font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- end card-body -->
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-5 text-primary">
                <i class="fas fa-crown" /> Owners
              </h4>
              <div class="row" v-if="locations.length > 0">
                <div class="col-4" v-for="owner in owners" :key="owner.owner_id">
                  <h6>
                    <i class="bx bx-user" />
                    {{owner.owner_firstname}} {{owner.owner_lastname}}
                  </h6>
                </div>
              </div>
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
              <h4 class="card-title text-primary">
                <i class="fas fa-person-booth" /> Visitors
              </h4>
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
                  striped
                  hover
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
                  <template v-slot:cell(temperature)="row">
                    <span
                      class="badge badge-pill font-size-12"
                      :class="{
                        'badge-danger': row.item.temperature >= 39,
                        'badge-warning': row.item.temperature >= 37,
                        'badge-success': row.item.temperature < 37
                      }"
                    >{{ row.item.temperature}}</span>
                  </template>
                  <template v-slot:cell(issues)="row">
                    <span
                      v-if="hadIssues(row.item)"
                      class="badge badge-pill badge-danger font-size-12 mr-1"
                    >
                      <i class="bx bx-sad" />
                      One or more sympotoms.
                    </span>
                    <span v-else class="badge badge-pill badge-success font-size-12 mr-1">
                      <i class="bx bx-happy" />
                      No symptoms.
                    </span>
                  </template>
                  <template v-slot:cell(dateCreated)="row">
                    <i class="fas fa-calendar-day mr-1" />
                    {{row.item.dateCreated}}
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
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-5 text-primary">
                <i class="fas fa-location-arrow" /> Locations
              </h4>
              <ul class="verti-timeline list-unstyled row" v-if="locations.length > 0">
                <li
                  class="event-list col-4"
                  v-for="location in locations"
                  :key="location.locationId"
                >
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
    <b-modal
      id="modal-standard"
      title="Company"
      title-class="font-18"
      ok-title="Save Changes"
      cancel-title="Cancel"
      @ok="saveCompany"
    >
      <h5>EDIT COMPANY DETAILS</h5>
      <div class="row">
        <div class="col-12">
          <form class="form-horizontal" role="form" v-if="editedCompany">
            <b-form-group
              id="companyName"
              label-cols-sm="2"
              label-cols-lg="2"
              label="Company Name"
              label-for="companyName"
            >
              <b-form-input for="companyName" v-model="editedCompany.company_name"></b-form-input>
            </b-form-group>

            <b-form-group
              id="company_address"
              label-cols-sm="2"
              label-cols-lg="2"
              label="Company Address"
              label-for="company_address"
            >
              <textarea
                v-model="editedCompany.company_address"
                class="form-control"
                :maxlength="225"
                rows="3"
                placeholder="Company Address"
              ></textarea>
            </b-form-group>

            <b-form-group
              id="company_vat"
              label-cols-sm="2"
              label-cols-lg="2"
              label="VAT"
              label-for="company_vat"
            >
              <b-form-input
                id="company_vat"
                v-model="editedCompany.company_vat"
                type="number"
                name="company_vat"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="company_email"
              label-cols-sm="2"
              label-cols-lg="2"
              label="Company Email"
              label-for="company_email"
            >
              <b-form-input id="company_email" v-model="editedCompany.company_email"></b-form-input>
            </b-form-group>
          </form>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>
