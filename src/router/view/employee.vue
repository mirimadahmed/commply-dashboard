<script>
import Layout from "../layouts/main";
import Declaration from "@/components/widgets/declaration";
import Profile from "@/components/widgets/profile";
import Meetings from "@/components/widgets/meetings";
import DeclarationStat from "@/components/widgets/declaration-stat";
import DailyCheck from "@/components/widgets/daily-check";
import api from "@/api";

export default {
  components: {
    Layout,
    Declaration,
    DeclarationStat,
    DailyCheck,
    Profile,
    Meetings,
  },
  mounted() {
    this.id = this.$route.query.id;
    this.fetch();
  },
  methods: {
    async fetch() {
      this.isLoading = true;
      const { data } = await api.employees(this.id);
      this.checks = data.daily_checks;
      this.date_options = this.checks.map((item) => ({
        text: item.date_created,
        value: item.date_created,
      }));
      if (this.date_options.length > 0) {
        this.selected_date = this.date_options[0].value;
      }
      if (data.declaration.length > 0) {
        this.hasDeclaration = true;
        let arr = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
        ];
        let yesses = [];
        let nos = [];
        arr.forEach((i) => {
          if (data.declaration[0][`q${i}`] === "YES") {
            yesses.push(1);
            nos.push(0);
          } else {
            nos.push(1);
            yesses.push(0);
          }
        });
        this.declarations[0].data = yesses;
        this.declarations[1].data = nos;
        let count = yesses.filter((item) => item === 1).length;
        let percent = (count / 19) * 100;
        this.declarationPercentage = [];
        this.declarationPercentage.push(percent);
      } else {
        this.hasDeclaration = false;
      }
      this.locationLogs = data.location_logs;
      this.meetings = data.meetings;
      this.profile = data.employee[0];
      this.isLoading = false;
    },
  },
  computed: {
    daily_check() {
      let data = [
        {
          name: "YES",
          data: [],
        },
        {
          name: "NO",
          data: [],
        },
      ];
      if (this.selected_date !== null) {
        let yesses = [];
        let nos = [];
        const index = this.checks.findIndex(
          (i) => i.date_created == this.selected_date
        );
        Object.keys(this.pillMap).forEach((item) => {
          if (this.checks[index][item] === "YES") {
            yesses.push(1);
            nos.push(0);
          } else {
            nos.push(1);
            yesses.push(0);
          }
        });
        data[0].data = yesses;
        data[1].data = nos;
      }
      return data;
    },
  },
  data() {
    return {
      id: null,
      isLoading: false,
      hasDeclaration: true,
      locationLogs: [],
      declarations: [
        {
          name: "YES",
          data: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0],
        },
        {
          name: "NO",
          data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
        },
      ],
      declarationPercentage: [80],
      checks: [],
      meetings: [],
      profile: null,
      pillMap: {
        sore_throat: "Sore Throat",
        cough: "Cough",
        loss_of_smell: "Loss Of Smell",
        body_aches: "Body Aches",
        fever: "Fever",
        redness: "Redness",
        shortness_of_breath: "Shortness of Breath",
        nausea: "Nausea",
        vomiting: "Vomiting",
        diarrhea: "Diarrhea",
        weakness: "Weakness",
        contact_with: "Contact with infected",
      },
      selected_date: null,
      date_options: [],
      chartOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "30%",
            barHeight: "100%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "Sore Throat",
            "Cough",
            "Loss Of Smell",
            "Body Aches",
            "Fever",
            "Redness",
            "Shortness of Breath",
            "Nausea",
            "Vomiting",
            "Diarrhea",
            "Weakness",
            "Contact with infected",
          ],
        },
        colors: ["#08A251", "#E7E540"],
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
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
      <div class="row">
        <div class="col-xl-4">
          <Profile :profile="profile" class="mb-4" />
          <DeclarationStat v-if="hasDeclaration" :series="declarationPercentage" />
        </div>
        <!-- end col -->
        <div class="col-xl-8">
          <div class="card py-5">
            <div class="card-body" v-if="date_options.length > 0">
              <h4 class="card-title mb-4">Daily check</h4>
              <b-form-select v-model="selected_date" :options="date_options"></b-form-select>

              <apexchart
                class="apex-charts"
                type="bar"
                dir="ltr"
                height="362"
                :series="daily_check"
                :options="chartOptions"
              ></apexchart>
            </div>
            <div class="card-body" v-else>
              <h4 class="card-title mb-4">Daily check</h4>
              <div class="text-center">
                No data.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row my-4">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-5">
                <i class="bx bx-map-pin"></i> Location Logs
              </h4>
              <div class="row" v-if="locationLogs.length > 0">
                <div
                  class="col-6 row"
                  v-for="locationLog in locationLogs"
                  :key="locationLog.location_id"
                >
                  <div class="col-1">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="col-11 text-left">
                    <div class="mr-3">
                      <h5 class="font-size-14">
                        {{locationLog.time_created}} - {{locationLog.current_location}}
                        <i
                          class="bx bx-right-arrow-alt font-size-16 text-primary align-middle ml-2"
                        ></i>
                        {{locationLog.next_location}}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text text-center">No data.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Daily Checks</h4>
              <DailyCheck :checks="checks" />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="card my-4">
            <div class="card-body">
              <h4 class="card-title">Meetings</h4>
              <Meetings :meetings="meetings" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
