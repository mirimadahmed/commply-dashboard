<script>
export default {
  props: {
    checks: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      showModal: false,
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
    };
  },
};
</script>

<template>
  <div class="table-responsive mb-0">
    <table class="table table-centered table-nowrap" v-if="checks.length > 0">
      <thead class="thead-light">
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Symptoms</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in checks" :key="data.daily_id">
          <td>{{data.date_added}}</td>
          <td>{{data.location}}</td>
          <td >
            <span
              v-for="pill in Object.keys(pillMap)" :key="pill"
              class="badge badge-pill badge-success font-size-12 mr-1"
              :class=" { 'badge-danger': `${data[pill]}` === 'YES' }"
            >
              {{pillMap[pill]}}
              <i
                :class=" { 
                  'bx bx-sad': `${data[pill]}` === 'YES',
                  'bx bx-happy': `${data[pill]}` === 'NO'
                }"
              />
            </span>
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