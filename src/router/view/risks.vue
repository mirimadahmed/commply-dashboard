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
        { key: "status", sortable: true },
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
        { key: "due_date", sortable: true },
        { key: "risk_classification", sortable: true },
      ]
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
      this.risk = row.item;
    },
    getName(field) {
      return field.split('_').join(' ')
    }
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
      id="modal-view"
      title="Risk"
      title-class="font-18"
    >
      <h5>Risk DETAILS</h5>
      <div class="row" v-if="risk">
        <div class="col-12">
          <h5 v-for="field in modalFields" :key="field.key">
            {{getName(field.key)}} - {{risk[field.key]}}
          </h5>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>