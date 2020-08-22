<script>
import Layout from "../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { mapState } from "vuex";

import api from "@/api";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "Companies",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: [],
      isLoading: false,
      title: "Companies",
      items: [
        {
          text: "Manage Companies",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "company_name",
      sortDesc: false,
      fields: [
        { key: "company_name", sortable: true },
        { key: "company_address", sortable: true },
        { key: "company_vat", sortable: true },
        { key: "company_email", sortable: true },
        { key: "date_created", sortable: true },
        { key: "action", sortable: false },
      ],
      editedCompany: null,
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    },
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
  },
  mounted() {
    // Set the initial number of items
    if(this.user.is_owner === "true") {
      this.$router.push(`/view-company?id=${this.user.company_id}`);
    }
    let company_id = this.user.company_id ? this.user.company_id : null;
    this.fetch(company_id);
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
    async fetch(company_id) {
      this.isLoading = true;
      const { data } = await api.companies(company_id);
      if (data.hasOwnProperty("company")) {
        this.tableData = [data.company];
        this.totalRows = 1;
      } else {
        this.totalRows = data.length;
        this.tableData = data;
      }
      this.isLoading = false;
    },
    editCompany(row) {
      this.editedCompany = JSON.parse(JSON.stringify(row.item));
    },
    viewCompany(row) {
      this.$router.push(`/view-company?id=${row.item.company_id}`);
    },
    async saveCompany() {
      this.isLoading = true;
      const { data } = await api.updateCompany(this.editedCompany);
      const index = this.tableData.findIndex(
        (item) => item.company_id === this.editedCompany.company_id
      );
      if (index > -1) {
        this.tableData[index] = JSON.parse(JSON.stringify(this.editedCompany));
      }
      this.isLoading = false;
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body text-center" v-if="isLoading">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
          </div>
          <div class="card-body" v-else>
            <h4 class="card-title text-primary"><i class="fas fa-briefcase" /> Manage Companies</h4>
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    <span class="mr-1">Show</span>
                    <b-form-select class="mr-1" v-model="perPage" size="sm" :options="pageOptions"></b-form-select>entries
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
                :items="tableData"
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
                <template v-slot:cell(action)="row">
                  <b-button-group>
                    <b-button
                      v-b-modal.modal-standard
                      @click="editCompany(row)"
                      variant="primary"
                      size="sm"
                    >
                      <i class="bx bx-pencil"></i>
                    </b-button>
                    <b-button @click="viewCompany(row)" variant="success" size="sm">
                      <i class="fas fa-eye"></i>
                    </b-button>
                  </b-button-group>
                </template>
                <template v-slot:cell(date_created)="row">
                    <i class="fas fa-calendar-day mr-1" /> {{row.item.date_created}}
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