<script>
import { mapState } from "vuex";
import api from "@/api";
import Layout from "../layouts/main";
import DatePicker from "vue2-datepicker";

export default {
  components: {
    Layout,
    DatePicker
  },
  mounted() {
    this.fetchReports();
  },
  computed: {
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
    showFetch() {
      return this.report.start === null || this.report.end === null
    }
  },
  methods: {
    async fetchReports(isDateRange = false) {
      this.isLoading = true;
      const { data } = await api.visitor_stats({
        is_owner: this.user.is_owner,
        company_id: this.user.company_id ? this.user.company_id : null,
        isDateRange,
        ...this.report,
        reportType: this.selected_preset,
      });
      data.locations.forEach((item) => {
        this.charts[0].series.push(item.total_visitor_location);
        this.charts[0].chartOptions.labels.push(item.description);
      });
      this.charts[1].series = [
        data.totalScreened,
        data.symptoticVisitors,
        data.asymptoticVisitors,
      ];
      this.charts[2].series = [
        {
          name: "Cough",
          data: [],
        },
        {
          name: "Fever",
          data: [],
        },
        {
          name: "Breathing Issue",
          data: [],
        },
      ];
      data.chartDates.forEach((item) => {
        this.charts[2].chartOptions.xaxis.categories.push(item);
        let lines = ["chartCough", "chartFever", "chartBreathing"];
        lines.forEach((line, i) => {
          if (data[line].hasOwnProperty(item)) {
            this.charts[2].series[i].data.push(data[line][item]);
          } else {
            this.charts[2].series[i].data.push(0);
          }
        });
      });
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
        start: "",
        end: "",
      },
      selected_preset: "",
      charts: [
        {
          series: [],
          chartOptions: {
            chart: {
              type: "donut",
              height: 240,
            },
            labels: [],
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
        {
          series: [],
          chartOptions: {
            chart: {
              type: "donut",
              height: 240,
            },
            labels: ["Total", "Symptomatic", "Asymptomatic"],
            colors: ["#556ee6", "#34c38f", "#f46a6a"],
            legend: {
              show: false,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "50%",
                },
              },
            },
          },
        },
        {
          series: [],
          chartOptions: {
            xaxis: {
              categories: [],
            },
            chart: {
              height: 320,
              type: "line",
              toolbar: "false",
              dropShadow: {
                enabled: true,
                color: "#000",
                top: 18,
                left: 7,
                blur: 8,
                opacity: 0.2,
              },
            },
            dataLabels: {
              enabled: false,
            },
            colors: ["#556ee6", "#34c38f", "#f46a6a"],
            stroke: {
              curve: "smooth",
              width: 3,
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
            <h4 class="mb-0 font-size-18">Visitor Dashboard</h4>
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
              <h4 class="card-title mb-4">Visitor By Location Data</h4>
              <div>
                <apexchart
                  class="apex-charts"
                  dir="ltr"
                  height="300"
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
              <h4 class="card-title mb-4">Total Vs Symptomatic Vs Asymptomatic</h4>
              <div>
                <apexchart
                  class="apex-charts"
                  dir="ltr"
                  height="300"
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
      <div class="row my-4">
        <div class="col-xl-6">
          <div class="card">
            <div class="card-body">
              <h4>Current Trend - {{ this.charts[2].chartOptions.xaxis.categories[0] }} - {{ this.charts[2].chartOptions.xaxis.categories[6] }}</h4>
              <div>
                <apexchart
                  class="apex-charts"
                  dir="ltr"
                  height="320"
                  :series="charts[2].series"
                  :options="charts[2].chartOptions"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
