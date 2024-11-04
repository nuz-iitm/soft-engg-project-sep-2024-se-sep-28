import side_bar_admin from "./side_bar_admin.js"
export default {
    template: `
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3">
              <side_bar_admin></side_bar_admin>
            </div>
            <div class="col-md-9">
              <div>
                <h2 class="card text-center mt-5">LIST OF INSTRUCTORS AND TA'S</h2>
              </div>
            </div>
          </div>
        </div>
        `,

    data() {
            return {

            }
        },
    components:{
        side_bar_admin
    },
    methods: {

        },
}