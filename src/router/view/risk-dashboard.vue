<script>
import api from "@/api";
import Layout from "../layouts/main";
import { mapState } from "vuex";
import DatePicker from "vue2-datepicker";

export default {
  components: {
    Layout,
    DatePicker
  },
  computed: {
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
    showFetch() {
      return this.report.start === null || this.report.end === null
    }
  },
  mounted() {
    this.fetchReports();
  },
  methods: {
    async fetchReports(isDateRange = false) {
      this.isLoading = true;
      const { data } = await api.risk_stats({
        is_owner: this.user.is_owner,
        company_id: this.user.company_id ? this.user.company_id : null,
        isDateRange,
        ...this.report,
        reportType: this.selected_preset,
      });
      this.charts[0].series = [data.riskLogged];
      this.charts[1].series = [data.riskAssessed];
      this.charts[2].series = [data.openRisk, data.closedRisk];
      this.isLoading = false;
    },
  },
  data() {
    return {
      isLoading: false,
      date_options: [
        { value: null, text: "Please select a report type" },
        { value: "today", text: "Today" },
        { value: "week", text: "This Week" },
        { value: "month", text: "This Month" },
      ],
      report: {
        start: null,
        end: null,
      },
      selected_preset: "",
      charts: [
        {
          series: [],
          chartOptions: {
            chart: {
              offsetY: -10,
            },
            plotOptions: {
              radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                  name: {
                    fontSize: "13px",
                    color: undefined,
                    offsetY: 60,
                  },
                  value: {
                    offsetY: 22,
                    fontSize: "16px",
                    color: undefined,
                    formatter: function (val) {
                      return val;
                    },
                  },
                },
              },
            },
            colors: ["#008000"],
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91],
              },
            },
            stroke: {
              dashArray: 4,
            },
            labels: ["Risks Logged"],
          },
        },
        {
          series: [],
          chartOptions: {
            chart: {
              offsetY: -10,
            },
            plotOptions: {
              radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                  name: {
                    fontSize: "13px",
                    color: undefined,
                    offsetY: 60,
                  },
                  value: {
                    offsetY: 22,
                    fontSize: "16px",
                    color: undefined,
                    formatter: function (val) {
                      return val;
                    },
                  },
                },
              },
            },
            colors: ["#008000"],
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91],
              },
            },
            stroke: {
              dashArray: 4,
            },
            labels: ["Walkthroughs"],
          },
        },
        {
          series: [],
          chartOptions: {
            colors: ["#556ee6", "#34c38f"],
            chart: {
              type: "donut",
              height: 240,
            },
            labels: ["Open Risks", "Closed Risks"],
            legend: {
              show: false,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "40%",
                },
              },
            },
          },
        },
      ],
    };
  },
};
</script>

<template>
  <Layout>
    <div class="card-body text-center" v-if="isLoading">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div v-else>
      <div class="row my-4">
        <div class="col">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="mb-0 font-size-18">Risk Dashboard</h4>
          </div>
        </div>
        <div class="col">
          <b-form-select @change="fetchReports" v-model="selected_preset" :options="date_options"></b-form-select>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">SELECT BETWEEN TWO DATES</h4>
              <div class="row">
                <div class="col">
                  <date-picker v-model="report.start" lang="en"></date-picker>
                </div>
                <div class="col">
                  <date-picker v-model="report.end" lang="en"></date-picker>
                </div>
                <div class="col">
                  <b-button :disabled="showFetch" @click="fetchReports(true)" variant="primary">Fetch</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">No of Risks Logged</h4>
              <div>
                <apexchart
                  class="apex-charts"
                  dir="ltr"
                  height="300"
                  type="radialBar"
                  :series="charts[0].series"
                  :options="charts[0].chartOptions"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">No of Walkthroughs Completed</h4>
              <div>
                <apexchart
                  class="apex-charts"
                  dir="ltr"
                  height="300"
                  type="radialBar"
                  :series="charts[1].series"
                  :options="charts[1].chartOptions"
                ></apexchart>
              </div>

              <div class="text-center text-muted">
                <div class="row">
                  <div
                    class="col"
                    v-for="(label, index) in charts[1].chartOptions.labels"
                    :key="index"
                  >
                    <div class="mt-4">
                      <p class="mb-2 text-truncate">
                        <i
                          class="mdi mdi-circle mr-1"
                          :style="`color: ${charts[1].chartOptions.colors[index]}`"
                        ></i>
                        {{ label }}
                      </p>
                      <h5>{{ charts[1].series[index] }}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Open vs Closed Risk</h4>
              <div>
                <apexchart
                  class="apex-charts"
                  dir="ltr"
                  height="300"
                  :series="charts[2].series"
                  :options="charts[2].chartOptions"
                ></apexchart>
              </div>
              <div class="text-center text-muted">
                <div class="row">
                  <div
                    class="col"
                    v-for="(label, index) in charts[2].chartOptions.labels"
                    :key="index"
                  >
                    <div class="mt-4">
                      <p class="mb-2 text-truncate">
                        <i
                          class="mdi mdi-circle mr-1"
                          :style="`color: ${charts[2].chartOptions.colors[index]}`"
                        ></i>
                        {{ label }}
                      </p>
                      <h5>{{ charts[2].series[index] }}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
