<script>
import Layout from "../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import api from "@/api";
import { mapState } from "vuex";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "Employees",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: [],
      isLoading: false,
      title: "Employees",
      items: [
        {
          text: "Manage Employees",
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
        { key: "employee_firstname", sortable: true },
        { key: "employee_middlename", sortable: true },
        { key: "employee_lastname", sortable: true },
        { key: "employee_number", sortable: true },
        { key: "employee_job", sortable: true },
        { key: "employee_telephone", sortable: true },
        { key: "date_created", sortable: true },
        { key: "action", sortable: false },
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
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
  },
  mounted() {
    // Set the initial number of items
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
      if (company_id === null) {
        const { data } = await api.employees(company_id);
        this.totalRows = data.length;
        this.tableData = data;
      } else {
        const { data } = await api.allEmployees(company_id);
        this.totalRows = data.length;
        this.tableData = data;
      }

      this.isLoading = false;
    },
    viewEmployee(row) {
      this.$router.push(`/view-employee?id=${row.item.employee_id}`);
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
            <h4 class="card-title text-primary"><i class="bx bxs-user-detail" /> Manage Employees</h4>
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
                  <b-button @click="viewEmployee(row)" variant="primary" size="sm"><i class="fas fa-eye" /></b-button>
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
  </Layout>
</template>