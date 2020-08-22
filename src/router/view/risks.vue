<script>
import Layout from "../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import api from "@/api";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "Risks",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: [],
      isLoading: false,
      title: "Risks",
      items: [
        {
          text: "Manage Risks",
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
        { key: "site", sortable: true },
        { key: "sector", sortable: true },
        { key: "department", sortable: true },
        { key: "work_area", sortable: true },
        // { key: "occupations", sortable: true },
        // { key: "risk_assessor", sortable: true },
        // { key: "employer_representative", sortable: true },
        // { key: "health_safety_representative", sortable: true },
        // { key: "source_of_hazard", sortable: true },
        // { key: "route_of_exposure", sortable: true },
        // { key: "activities", sortable: true },
        // { key: "existing_control_measure", sortable: true },
        // { key: "control_effectiveness", sortable: true },
        // { key: "addition_controls", sortable: true },
        // { key: "due_date", sortable: true },
        // { key: "risk_classification", sortable: true },
        { key: "date_created", sortable: true },
        { key: "status", sortable: true },
        { key: "action", sortable: false },
      ],
      risk: null,
      modalFields: [
        { key: "occupations", sortable: true },
        { key: "risk_assessor", sortable: true },
        { key: "employer_representative", sortable: true },
        { key: "health_safety_representative", sortable: true },
        { key: "source_of_hazard", sortable: true },
        { key: "route_of_exposure", sortable: true },
        { key: "activities", sortable: true },
        { key: "existing_control_measure", sortable: true },
        { key: "control_effectiveness", sortable: true },
        { key: "addition_controls", sortable: true },
      ],
      risk_options: [
        {
          text: "Select a status",
          value: null,
        },
        {
          text: "Closed",
          value: "Closed",
        },
        {
          text: "In Progress",
          value: "In Progress",
        },
        {
          text: "Open",
          value: "Open",
        },
      ],
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    },
  },
  mounted() {
    // Set the initial number of items
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
      const { data } = await api.risks();
      this.isLoading = false;
      this.totalRows = data.length;
      this.tableData = data;
    },
    viewRisk(row) {
      this.risk = JSON.parse(JSON.stringify(row.item));
    },
    getName(field) {
      return field.split("_").join(" ");
    },
    async updateStatus() {
      this.isLoading = true;
      const { data } = await api.updateRisk(this.risk);
      if (data.error === 0) {
        const index = this.tableData.findIndex(
          (item) => item.risk_id === this.risk.risk_id
        );
        if (index > -1) {
          this.tableData[index] = JSON.parse(JSON.stringify(this.risk));
        }
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
            <h4 class="card-title text-primary">
              <i class="fas fa-diagnoses" /> Manage Risks
            </h4>
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
                    <b-button v-b-modal.modal-edit @click="viewRisk(row)" variant="primary" size="sm">
                      <i class="bx bx-pencil"></i>
                    </b-button>
                    <b-button
                      v-b-modal.modal-view
                      @click="viewRisk(row)"
                      variant="success"
                      size="sm"
                    >
                      <i class="fas fa-eye" />
                    </b-button>
                  </b-button-group>
                </template>
                <template v-slot:cell(date_created)="row">
                  <i class="fas fa-calendar-day mr-1" />
                  {{row.item.date_created}}
                </template>
                <template v-slot:cell(status)="row">
                  <span
                    class="badge badge-pill"
                    :class="{
                    'badge-primary': row.item.status === 'Open',
                    'badge-success': row.item.status === 'Closed',
                    'badge-danger': row.item.status === 'In Progress'
                  }"
                  >{{row.item.status}}</span>
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
    <b-modal id="modal-view" title="Risk Details" title-class="font-18">
      <div v-if="risk">
        <div class="text-center">
          <div class="mb-3">
            <i class="mdi mdi-card-account-details-star-outline text-danger display-4"></i>
          </div>
          <h3>Risk Classification</h3>
          <p>
            <label class="badge"
            :class="{
              'badge-warning': risk.risk_classification === 'Medium Exposure Risk',
              'badge-info': risk.risk_classification === 'Low Exposure Risk',
              'badge-danger': risk.risk_classification === 'High Exposure Risk'
            }">{{ risk.risk_classification }}</label>
            <br />
            <i class="fas fa-calendar-day mr-1" /> {{risk.date_created}}
          </p>
        </div>
        <b-table stacked :items="[risk]" :fields="modalFields" />
      </div>
    </b-modal>
    <b-modal
      id="modal-edit"
      title="Risk Status"
      title-class="font-18"
      @ok="updateStatus"
      ok-title="Update Status"
    >
      <h5>Update Risk Status</h5>
      <div v-if="risk">
        <b-form-group
          id="risk_status"
          label-cols-sm="2"
          label-cols-lg="3"
          label="Risk Status"
          label-for="risk_status"
        >
          <b-form-select v-model="risk.status" :options="risk_options"></b-form-select>
        </b-form-group>
      </div>
    </b-modal>
  </Layout>
</template>