var app = new Vue({
    el: "#app",
    components: {
        vuejsDatepicker
    },
    data: {
        showAdminLoginPanel: true,
        showCreateGroupPanel: false,
        errorMsg: "",
        successMsg: "",
        group_name: "",
        gift_exchange_date: "",
        userData: {
            email: "",
            password: ""
        },
        newGroup: { group_code: "",
                    group_name: "",
                    exchange_gift_date: "",
                    signup_deadline: "",
                    spending_minimum: "",
                    admin_name: "",
                    admin_email: "",
                    admin_password: "" }
    },
    created(){

    },

    mounted: function(){
        //this.getAllGroup();  
    },

    methods: {
        randGroupCode: function(){  //Generate a random 10 character string for Group Code
            return 'xxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        adminLoginSeen: function(){
            this.showAdminLoginPanel = true;
            this.showCreateGroupPanel = false;
        },
        createGroupSeen: function(){
            this.showCreateGroupPanel = true;
            this.showAdminLoginPanel = false;
        },
        getAllGroup: function(){
            axios.get("api.php?action=read")
            .then(function(res){
                console.log(res.data.main_group)
            });
        },
        customFormatter(date) {
            return moment(date).format('MMMM Do YYYY');
        },
        addGroup: function(){   // Add new group to the database by calling our API, using axios
            app.newGroup.group_code = this.randGroupCode();
            app.newGroup.exchange_gift_date = moment(app.newGroup.exchange_gift_date).format("YYYY-MM-DD");   
            app.newGroup.signup_deadline = moment(app.newGroup.signup_deadline).format("YYYY-MM-DD");   

            console.log(app.newGroup);
			var formData = app.toFormData(app.newGroup);

			axios.post("api.php?action=create", formData)
			.then(function(response){
				
				app.newGroup = { group_code: "", group_name: "", exchange_gift_date: "", signup_deadline: "", spending_minimum: "", admin_name: "", admin_email: "", admin_password: "" };

				if(response.data.error){
					app.errorMsg = response.data.message; 
                } else{
                    app.successMsg = response.data.message;
                    app.getAllGroup();
                }

                setTimeout(()=>{ app.successMsg = ""; app.errorMsg = "" }, 4000);        
			});
        },
        toFormData: function(obj){
			var form_data = new FormData();
            for ( var key in obj ) {
                form_data.append(key, obj[key]);
            } 
            return form_data;
        },
		clearMessage: function(){
			app.errorMsg = "";
			app.successMsg = "";
		}
    }
});