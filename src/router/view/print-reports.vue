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
    title: "Print Reports",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
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
        { key: "action", sortable: false },
        { key: "status", sortable: true },
        { key: "company_name", sortable: true },
        { key: "site", sortable: true },
        { key: "sector", sortable: true },
        { key: "department", sortable: true },
        { key: "work_area", sortable: true },
        { key: "date_created", sortable: true },
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
        { key: "due_date", sortable: true },
        { key: "risk_classification", sortable: true },
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
    this.fetch();
    this.fetchBuildings();
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
    async fetchBuildings() {
      this.isLoading = true;
      const { data } = await api.buildings();
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
        is_owner: false,
        company_id: null
      }
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
        is_owner: false,
        company_id: null
      }
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
        is_owner: false,
        company_id: null
      }
      const { data } = await api.print_risk_report(report);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "risk_report.doc");
      document.body.appendChild(link);
      link.click();
      this.isLoading = false;
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
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
            <h4 class="card-title">Print Declaration Report</h4>
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
                <b-button @click="fetchDeclarationReport" variant="primary">Fetch</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 my-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">PRINT WALKTHROUGH REPORT</h4>
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
                  label="Select Building"
                  label-for="building_date"
                >
                  <b-form-input v-model="building_date" id="building_date-date" type="date"></b-form-input>
                </b-form-group>
              </div>
              <div class="col">
                <b-button @click="fetchWalkthroughReport" variant="primary">Fetch</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Manage Risks</h4>
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
                  <b-button
                    v-b-modal.modal-view
                    @click="viewRisk(row)"
                    variant="outline-primary"
                    class="mr-1"
                  >View</b-button>
                  <b-button @click="fetchRiskReport(row)" variant="outline-primary" class="mr-1">Print</b-button>
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
    <b-modal id="modal-view" title="Risk" title-class="font-18">
      <h5>Risk DETAILS</h5>
      <div class="row" v-if="risk">
        <div class="col-12">
          <h5
            v-for="field in modalFields"
            :key="field.key"
          >{{getName(field.key)}} - {{risk[field.key]}}</h5>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>