<script>
export default {
  props: {
    meetings: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    getMeeters(meeting) {
      return meeting.meeters.join(', ');
    }
  }
};
</script>

<template>
  <div class="table-responsive mb-0">
    <table class="table table-centered table-nowrap" v-if="meetings.length > 0">
      <thead class="thead-light">
        <tr>
          <th>Date</th>
          <th>With</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in meetings" :key="data.meeting_id">
          <td>{{data.date_created}}</td>
          <td>
            {{ getMeeters(data) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text text-center">
        No data.
    </div>
  </div>
  <!-- end table -->
</template>