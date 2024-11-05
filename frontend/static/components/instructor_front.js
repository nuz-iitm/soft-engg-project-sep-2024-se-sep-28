import side_bar_inst from "./side_bar_inst.js"
export default {
    template: `
        <div class="container-fluid">
            <div class="row">
            <div class="col-md-3" style="max-width: 300px; overflow-x: hidden;">
                <side_bar_inst></side_bar_inst>
            </div>
            <div class="col-md-9">
                <div class="row">
                <div class="col-md-6 mb-4">
                    <h2 class="card text-center mt-5">Dashboard</h2>
                    <!-- Add your dashboard section content here -->
                </div>
                <div class="col-md-6 mb-4">
                    <h2 class="card text-center mt-5">Visualizations</h2>
                    <!-- Add your visualization section content here -->
                </div>
                </div>

                <div class="row">
                <div class="col-md-12 mb-4">
                    <h2 class="card text-center mt-5">Top Teams</h2>
                    <!  top three teams based on certain criteria -->
                    <!-- You can filter and sort the team data based on your requirements -->
                    <div class="row">
                    <div class="col-md-4 mb-4" v-for="(team, index) in topTeams" :key="index">
                        <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ team.name }}</h5>
                            <p class="card-text">Commits: {{ team.commits }}</p>
                            <!-- Add more information about the team in the card -->
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        `,

    data() {
            return {
                topTeams: [
                    { id: 1, name: "Team A", commits: 100 },
                    { id: 2, name: "Team B", commits: 80 },
                    { id: 3, name: "Team C", commits: 60 }
                  ]
            }
        },
    components:{
        side_bar_inst
    },
    methods: {

        },
}