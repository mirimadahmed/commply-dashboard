<script>
import Layout from "../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { mapState } from "vuex";
import api from "@/api";
import DatePicker from "vue2-datepicker";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "Get Report",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, DatePicker },
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
        company_id: null,
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
      if (
        this.report.table_name === "" ||
        this.report.start === null ||
        this.report.end === null
      ) {
        return;
      }
      this.isLoading = true;
      this.report.is_owner = this.user.is_owner;
      this.report.company_id = this.user.company_id
        ? this.user.company_id
        : null;
      const { data } = await api.print_reports(this.report);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", this.report.table_name + "_report.csv");
      document.body.appendChild(link);
      link.click();
      this.isLoading = false;
    },
  },
  computed: {
    showFetch() {
      return (
        this.report.table_name === "" ||
        this.report.start === null ||
        this.report.end === null
      );
    },
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
            <h4 class="card-title text-primary">
              <i class="fas fa-table" /> Export table reports
            </h4>
            <div class="row">
              <div class="col">
                <date-picker type="date" v-model="report.start" format="YYYY-MM-DD" />
              </div>
              <div class="col">
                <date-picker type="date" v-model="report.end" format="YYYY-MM-DD" />
              </div>
              <div class="col">
                <b-form-select v-model="report.table_name" :options="table_options"></b-form-select>
              </div>
              <div class="col">
                <b-button :disabled="showFetch" @click="fetchReports" variant="primary">Fetch</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>