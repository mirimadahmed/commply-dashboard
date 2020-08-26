<script>
import Layout from "../layouts/main";
import api from "@/api";
import DatePicker from "vue2-datepicker";
import { mapState } from "vuex";

export default {
  components: {
    Layout,
    DatePicker,
  },
  data() {
    return {
      isLoading: false,
      setting: {
        employee_number: "",
        date: null,
      },
      meetingsData: null,
      msg: "",
    };
  },
  methods: {
    async fetch() {
      this.msg = "";
      this.isLoading = true;
      const { data } = await api.contact_tracing(this.setting);
      if (data.error === 0) {
        this.meetingsData = data;
      } else {
        this.msg = data.message;
      }
      this.isLoading = false;
    },
  },
  computed: {
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
    showFetch() {
      return this.setting.date === null || this.setting.employee_number === "";
    },
  },
};
</script>

<template>
  <Layout>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body text-center" v-if="isLoading">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
          </div>
          <div class="card-body" v-else>
            <h4 class="card-title text-primary">
              <i class="bx bx-transfer-alt" /> Contact tracing -
              <span class="text-danger">{{ msg }}</span>
            </h4>
            <div class="row my-4">
              <div class="col">
                <b-form-group
                  id="employeenumber"
                  label="Employee Number"
                  label-for="employeenumber"
                >
                  <b-form-input for="employeenumber" v-model="setting.employee_number"></b-form-input>
                </b-form-group>
              </div>
              <div class="col">
                <b-form-group id="date" label="Date" label-for="date">
                  <date-picker v-model="setting.date" type="datetime"></date-picker>
                </b-form-group>
              </div>
              <div class="col my-auto">
                <b-button :disabled="showFetch" @click="fetch" variant="primary">Fetch</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div role="tablist" v-if="meetingsData">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            v-b-toggle.accordion-1
            variant="primary"
          >Company Employees checked in 10 mins earlier or later</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <div class="row">
                <div class="col">
                  <h6>Employee Name</h6>
                  {{ meetingsData.employee.employee_firstname }} 
                  {{ meetingsData.employee.employee_middlename }} 
                  {{ meetingsData.employee.employee_lastname }}
                </div>
                <div class="col">
                  <h6>Checked in 10 mins earlier</h6>
                  <ul>
                    <li v-for="(person, index) in meetingsData.before10" :key="index">
                      {{ person.employee_firstname }} 
                      {{ person.employee_middlename }} 
                      {{ person.employee_lastname }}
                    </li>
                  </ul>
                </div>
                <div class="col">
                  <h6>Checked in 10 mins late</h6>
                  <ul>
                    <li v-for="(person, index) in meetingsData.after10" :key="index">
                      {{ person.employee_firstname }} 
                      {{ person.employee_middlename }} 
                      {{ person.employee_lastname }}
                    </li>
                  </ul>
                </div>
              </div>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-2 variant="primary">Meetings He Logged</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>
                      SR.
                    </th>
                    <th>
                      Company Name
                    </th>
                    <th>
                      Admin ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(meeting, index) in meetingsData.empMeeting" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ meeting.company_name }}</td>
                    <td>{{ meeting.admin_id ? meeting.admin_id : '' }}</td>
                  </tr>
                  <tr class="text-danger text-center" v-if="meetingsData.empMeeting.length === 0">
                    <td colspan="3">
                      No data found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-3 variant="primary">Meeting Persons</b-button>
        </b-card-header>
        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>
                      SR.
                    </th>
                    <th>
                      Person Name
                    </th>
                    <th>
                      Phone Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(meeting, index) in meetingsData.empMeetingPerson" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ meeting.person_name }}</td>
                    <td>{{ meeting.person_phone }}</td>
                  </tr>
                  <tr class="text-danger text-center" v-if="meetingsData.empMeetingPerson.length === 0">
                    <td colspan="3">
                      No data found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </Layout>
</template>
