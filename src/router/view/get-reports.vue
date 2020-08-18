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
    title: "Get Report",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: [],
      isLoading: false,
      title: "Get Report",
      items: [
        {
          text: "Get Report",
          active: true,
        },
      ],
      report: {
        table_name: "",
        start: null,
        end: null,
        is_owner: false,
        company_id: null
      },
      table_options: [
        {
          text: "Select a table",
          value: null,
        },
        {
          text: "Declaration",
          value: "declaration",
        },
        {
          text: "Visitor",
          value: "visitor",
        },
        {
          text: "Daily Screen",
          value: "daily_check",
        },
        {
          text: "Risk Report",
          value: "risk_report",
        },
        {
          text: "Risk Assessment",
          value: "risk_assessment",
        },
        {
          text: "Employee",
          value: "employee",
        },
        {
          text: "Owner",
          value: "owner",
        },
        {
          text: "Meetings",
          value: "meetings",
        },
      ],
    };
  },
  methods: {
    async fetchReports() {
      this.isLoading = true;
      this.report.is_owner = this.user.is_owner;
      this.report.company_id = this.user.company_id ? this.user.company_id : null;
      const { data } = await api.print_reports(this.report);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", this.report.table_name+"_report.csv");
      document.body.appendChild(link);
      link.click();
      this.isLoading = false;
    },
  },
  computed: {
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
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
            <h4 class="card-title">Select table to extract reports</h4>
            <div class="row">
              <div class="col-md-4">
                <b-form-input v-model="report.start" id="start-date" type="date"></b-form-input>
              </div>
              <div class="col-md-4">
                <b-form-input v-model="report.end" id="end-date" type="date"></b-form-input>
              </div>
              <div class="col-md-4">
                <b-form-select v-model="report.table_name" :options="table_options"></b-form-select>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-4">
                <b-button @click="fetchReports" variant="primary">Fetch</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>