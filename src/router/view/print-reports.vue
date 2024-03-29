<script>
import Layout from "../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import api from "@/api";
import { mapState } from "vuex";
import DatePicker from "vue2-datepicker";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "Print Reports",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, DatePicker },
  computed: {
    showFetch() {
      return this.building_name === "" || this.building_date === null;
    },
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
    rows() {
      return this.tableData.length;
    },
  },
  data() {
    return {
      employee_number: "",
      building_name: "",
      building_date: null,
      tableData: [],
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
        { key: "status", sortable: true },
        { key: "date_created", sortable: true },
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
      isLoading: false,
      title: "Print Reports",
      items: [
        {
          text: "Print Reports",
          active: true,
        },
      ],
      report: {
        table_name: "",
        start: null,
        end: null,
        is_owner: false,
        company_id: null,
      },
      building_options: [
        {
          text: "Select building",
          value: null,
        },
      ],
    };
  },
  mounted() {
    // Set the initial number of items
    let company_id = this.user.company_id ? this.user.company_id : null;
    this.fetch(company_id);
    this.fetchBuildings(company_id);
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
      const { data } = await api.risks(company_id);
      this.isLoading = false;
      this.totalRows = data.length;
      this.tableData = data;
    },
    async fetchBuildings(company_id) {
      this.isLoading = true;
      const { data } = await api.buildings(company_id);
      data.forEach((item) =>
        this.building_options.push({
          text: item.building,
          value: item.building,
        })
      );
      this.isLoading = false;
    },
    viewRisk(row) {
      this.risk = JSON.parse(JSON.stringify(row.item));
    },
    getName(field) {
      return field.split("_").join(" ");
    },
    async fetchDeclarationReport() {
      this.isLoading = true;
      const report = {
        employee_number: this.employee_number,
        is_owner: this.user.is_owner,
        company_id: this.user.company_id ? this.user.company_id : null,
      };
      const { data } = await api.print_declarations(report);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "declaration_report.doc");
      document.body.appendChild(link);
      link.click();
      this.isLoading = false;
    },
    async fetchWalkthroughReport() {
      this.isLoading = true;
      const report = {
        buliding: this.building_name,
        date: this.building_date,
        is_owner: this.user.is_owner,
        company_id: this.user.company_id ? this.user.company_id : null,
      };
      const { data } = await api.print_walkthroughs(report);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "walkthrough_report.doc");
      document.body.appendChild(link);
      link.click();
      this.isLoading = false;
    },
    async fetchRiskReport(row) {
      this.isLoading = true;
      const report = {
        risk_id: row.item.risk_id,
        is_owner: this.user.is_owner,
        company_id: this.user.company_id ? this.user.company_id : null,
      };
      const { data } = await api.print_risk_report(report);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "risk_report.doc");
      document.body.appendChild(link);
      link.click();
      this.isLoading = false;
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="card-body text-center" v-if="isLoading">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-primary">
              <i class="fab fa-wpforms" /> Print Declaration Report
            </h4>
            <div class="row">
              <div class="col">
                <b-form-group
                  id="employee_number"
                  label-cols-sm="3"
                  label-cols-lg="3"
                  label="Employee Number"
                  label-for="employee_number"
                >
                  <b-form-input id="employee_number" v-model="employee_number"></b-form-input>
                </b-form-group>
              </div>
              <div class="col">
                <b-button
                  :disabled="employee_number === ''"
                  @click="fetchDeclarationReport"
                  variant="primary"
                >Fetch</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 my-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-primary">
              <i class="fas fa-walking" /> Print Walkthrough Report
            </h4>
            <div class="row">
              <div class="col">
                <b-form-group
                  id="select_building"
                  label-cols-sm="3"
                  label-cols-lg="3"
                  label="Select Building"
                  label-for="select_building"
                >
                  <b-form-select v-model="building_name" :options="building_options"></b-form-select>
                </b-form-group>
              </div>
              <div class="col">
                <b-form-group
                  id="building_date"
                  label-cols-sm="3"
                  label-cols-lg="3"
                  label="Select Date"
                  label-for="building_date"
                >
                  <date-picker v-model="building_date" lang="en"></date-picker>
                </b-form-group>
              </div>
              <div class="col">
                <b-button
                  :disabled="showFetch"
                  @click="fetchWalkthroughReport"
                  variant="primary"
                >Fetch</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-primary">
              <i class="fas fa-diagnoses" /> Print Risk Report
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
                    <b-button
                      v-b-modal.modal-view
                      @click="viewRisk(row)"
                      variant="primary"
                      size="sm"
                    >
                      <i class="fas fa-eye" />
                    </b-button>
                    <b-button @click="fetchRiskReport(row)" variant="success" size="sm">
                      <i class="fas fa-print" />
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
          <p class="font-18 ">
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
        <b-table stacked small :items="[risk]" :fields="modalFields" />
      </div>
    </b-modal>
  </Layout>
</template>