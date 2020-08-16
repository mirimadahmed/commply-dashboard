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
    title: "Print Walkthroughs",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
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
        { key: "company_name", sortable: true },
        { key: "employee_firstname", sortable: true },
        { key: "location", sortable: true },
        { key: "building", sortable: true },
        { key: "latitude", sortable: true },
        { key: "longitude", sortable: true },
        { key: "date_created", sortable: true },
      ],
      isLoading: false,
      title: "Print Walkthroughs",
      items: [
        {
          text: "Print Walkthroughs",
          active: true,
        },
      ],
    };
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
      const settings = {
        is_owner: false,
        company_id: null
      };
      const { data } = await api.walkthroughs(settings);
      this.isLoading = false;
      this.totalRows = data.length;
      this.tableData = data;
    },
    async fetchWalkthroughReport(row) {
      this.isLoading = true;
      const report = {
        buliding: row.item.building,
        date: row.item.date_created,
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
            <h4 class="card-title">Print Walkthrough</h4>
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
                  <b-button @click="fetchWalkthroughReport(row)" variant="outline-primary" class="mr-1">Print</b-button>
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
  </Layout>
</template>