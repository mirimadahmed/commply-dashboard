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
    title: "Owners",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: [],
      isLoading: false,
      title: "Owners",
      items: [
        {
          text: "Manage Owners",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "owner_firstname",
      sortDesc: false,
      fields: [
        { key: "owner_firstname", sortable: true },
        { key: "owner_lastname", sortable: true },
        { key: "owner_email", sortable: true },
        { key: "owner_password", sortable: false },
        { key: "company_name", sortable: true },
        { key: "date_created", sortable: true },
        { key: "action", sortable: false },
      ],
      editedOwner: null,
      newOwner: {
        owner_email: "",
        owner_password: "",
        owner_firstname: "",
        owner_lastname: "",
        company_id: "",
      },
      company_options: [
        { value: null, text: "Please select an option" },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Selected Option" },
        { value: { C: "3PO" }, text: "This is an option with object value" },
        { value: "d", text: "This one is disabled", disabled: true },
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
    this.fetchCompanies();
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
      const { data } = await api.owners();
      this.isLoading = false;
      this.totalRows = data.length;
      this.tableData = data;
    },
    async fetchCompanies() {
      this.isLoading = true;
      const { data } = await api.companies();
      this.isLoading = false;
      this.company_options = data.map(item => ({value: item.company_id, text: item.company_name}));
    },
    editOwner(row) {
      this.editedOwner = JSON.parse(JSON.stringify(row.item));
    },
    deleteOwner(row) {
      this.editedOwner = JSON.parse(JSON.stringify(row.item));
    },
    addNewOwner() {
      this.newOwner = {
        owner_email: "",
        owner_password: "",
        owner_firstname: "",
        owner_lastname: "",
        company_id: "",
      }
    },
    async saveOwner() {
      this.isLoading = true;
      const { data } = await api.updateOwner(this.editedOwner);
      const index = this.tableData.findIndex(
        (item) => item.owner_id === this.editedOwner.owner_id
      );
      if (index > -1) {
        this.tableData[index] = JSON.parse(JSON.stringify(this.editedOwner));
      }
      this.isLoading = false;
    },
    async saveDeleteOwner() {
      this.isLoading = true;
      const { data } = await api.deleteOwner(this.editedOwner);
      const index = this.tableData.findIndex(
        (item) => item.owner_id === this.editedOwner.owner_id
      );
      if (index > -1) {
        this.tableData.splice(index, 1);
      }
      this.isLoading = false;
    },
    async addOwner() {
      this.isLoading = true;
      const { data } = await api.addOwner(this.newOwner);
      this.tableData.push(data);
      this.isLoading = false;
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
            <div class="row">
              <div class="col-md-8">
                <h4 class="card-title">Manage Owners</h4>
              </div>
              <div class="col-md-4 text-right">
                <b-button
                    v-b-modal.modal-add
                    @click="addNewOwner"
                    variant="primary"
                  >Add Owner</b-button>
              </div>
            </div>
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
                    v-b-modal.modal-edit
                    @click="editOwner(row)"
                    variant="outline-primary"
                    class="mr-1"
                  >Edit</b-button>
                  <b-button
                    v-b-modal.modal-delete
                    @click="deleteOwner(row)"
                    variant="outline-primary"
                  >Delete</b-button>
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
      id="modal-edit"
      title="Owner"
      title-class="font-18"
      ok-title="Save Changes"
      cancel-title="Cancel"
      @ok="saveOwner"
    >
      <h5>EDIT OWNER DETAILS</h5>
      <div class="row">
        <div class="col-12">
          <form class="form-horizontal" role="form" v-if="editedOwner">
            <b-form-group
              id="owner_email"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Owner Email"
              label-for="owner_email"
            >
              <b-form-input id="owner_email" v-model="editedOwner.owner_email"></b-form-input>
            </b-form-group>

            <b-form-group
              id="owner_password"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Owner Password"
              label-for="owner_password"
            >
              <b-form-input for="owner_password" v-model="editedOwner.owner_password"></b-form-input>
            </b-form-group>

            <b-form-group
              id="owner_firstname"
              label-cols-sm="2"
              label-cols-lg="3"
              label="First Name"
              label-for="owner_firstname"
            >
              <b-form-input for="owner_firstname" v-model="editedOwner.owner_firstname"></b-form-input>
            </b-form-group>

            <b-form-group
              id="owner_lastname"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Last Name"
              label-for="owner_lastname"
            >
              <b-form-input for="owner_lastname" v-model="editedOwner.owner_lastname"></b-form-input>
            </b-form-group>
          </form>
        </div>
      </div>
    </b-modal>
    <b-modal
      id="modal-delete"
      title="Owner"
      title-class="font-18"
      ok-title="Delete"
      cancel-title="Cancel"
      @ok="saveDeleteOwner"
    >
      <h5>Delete Owner</h5>
      <div class="row">
        <div class="col-12">
          <p>Are you sure you want to delete this owner?</p>
        </div>
      </div>
    </b-modal>
    <b-modal
      id="modal-add"
      title="Owner"
      title-class="font-18"
      ok-title="Create Owner"
      cancel-title="Cancel"
      @ok="addOwner"
    >
      <h5>Add Owner</h5>
      <div class="row">
        <div class="col-12">
          <form class="form-horizontal" role="form">
            <b-form-group
              id="owner_email"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Owner Email"
              label-for="owner_email"
            >
              <b-form-input id="owner_email" v-model="newOwner.owner_email"></b-form-input>
            </b-form-group>

            <b-form-group
              id="owner_password"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Owner Password"
              label-for="owner_password"
            >
              <b-form-input for="owner_password" v-model="newOwner.owner_password"></b-form-input>
            </b-form-group>

            <b-form-group
              id="owner_firstname"
              label-cols-sm="2"
              label-cols-lg="3"
              label="First Name"
              label-for="owner_firstname"
            >
              <b-form-input for="owner_firstname" v-model="newOwner.owner_firstname"></b-form-input>
            </b-form-group>

            <b-form-group
              id="owner_lastname"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Last Name"
              label-for="owner_lastname"
            >
              <b-form-input for="owner_lastname" v-model="newOwner.owner_lastname"></b-form-input>
            </b-form-group>

            <b-form-group
              id="owner_company_id"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Company"
              label-for="owner_company_id"
            >
              <b-form-select v-model="newOwner.company_id" :options="company_options"></b-form-select>
            </b-form-group>
          </form>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>