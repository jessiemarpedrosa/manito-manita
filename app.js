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
        currentDate: "",
        status: "",
        loaderImg: "assets/loader.gif",
        errors: [],
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
        //currentDate = new Date().toJSON().slice(0,10).replace(/-/g,'-');
        currentDate = new Date();
    },
    
    methods: {
        randGroupCode: function(){  //Generate a random 10 character string for Group Code
            return 'xxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        formatDate: function(val){
            return moment(val).format("YYYY-MM-DD");
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
            this.status = "Loading...";

			axios.post("api.php?action=create", formData)
			.then(function(response){
				
				app.newGroup = { group_code: "", group_name: "", exchange_gift_date: "", signup_deadline: "", spending_minimum: "", admin_name: "", admin_email: "", admin_password: "" };

				if(response.data.error){
                    app.errorMsg = response.data.message;
                    app.status = "";
                } else{
                    app.successMsg = response.data.message;
                    app.status = "";
                    app.getAllGroup();
                }

                console.log(response.data.message);
                setTimeout(()=>{ app.successMsg = ""; app.errorMsg = "" }, 5000);       
                this.status = "";

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
        },
        checkForm: function (e) {
            
            if (this.newGroup.group_name && this.newGroup.exchange_gift_date && this.newGroup.signup_deadline && this.newGroup.spending_minimum &&
                this.newGroup.admin_name && this.newGroup.admin_email && this.newGroup.admin_password) {
                // return true;
           
                this.newGroup.exchange_gift_date = moment(this.newGroup.exchange_gift_date).format("YYYY-MM-DD");
                this.newGroup.signup_deadline = moment(this.newGroup.signup_deadline).format("YYYY-MM-DD");

                console.log("Good to go!")
                app.addGroup();
            }
      
            this.errors = [];
            
            if (!this.newGroup.group_name) { this.errors.push('Group name required.'); }

            if (!this.newGroup.exchange_gift_date) { this.errors.push('Exchange gift date required.'); }
                if ( this.newGroup.exchange_gift_date != "" && (this.newGroup.exchange_gift_date <= currentDate) ) { 
                    this.errors.push('Exchange gift should be greater than the current date.'); }
           
            if (!this.newGroup.signup_deadline) { this.errors.push('Signup deadline required.'); }
                if ( this.newGroup.signup_deadline != "" && (this.newGroup.signup_deadline > this.newGroup.exchange_gift_date) ) { 
                    this.errors.push('Signup deadline should be earlier than Exchange gift date.'); }
                if ( this.newGroup.signup_deadline != "" && (this.newGroup.signup_deadline < currentDate) ) { 
                    this.errors.push('Signup deadline should be greater than the current date.'); }

            if (!this.newGroup.spending_minimum || this.newGroup.spending_minimum <= 0) { this.errors.push('Spending minimum required and should not be zero.'); }
            if (!this.newGroup.admin_name) { this.errors.push('Admin name required.'); }

            if (!this.newGroup.admin_email) { this.errors.push('Admin email required.'); }
            else if (!this.validEmail(this.newGroup.admin_email)) {
                this.errors.push('Please enter valid email.');
            }

            if (!this.newGroup.admin_password) { this.errors.push('Admin password required.'); }
            
            e.preventDefault();

        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }
});