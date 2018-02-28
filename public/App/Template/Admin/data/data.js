var dummy = [];
var table = [];

var dumDO = [7.8];
var dumPompa = [false];
var begin = true;

var randomData = function(callback){
for(var i = 0; i < 1; i++){
	if(dumDO[i] < 3){
		dumPompa[i] = true;
	}
	else if(dumDO[i] > 7){
		dumPompa[i] = false;
	}

	dumDO[i] -= 0.05;
	if(dumPompa[i]){
		dumDO[i] += 0.1;
	}

	dummy[i] = [
		{
			sensor_id: 1,
			sensor_name: 'DO',
			user_id: 37,
			detail: [
				{
					id: 1,
					name: 'DO',
					value: dumDO[i],
	                is_control: 0,
	                updated_at: "26/01/2018, 02:51 WIB",
	                secret_code: "abc"
				}
			]
		},
		{
			sensor_id: 2,
			sensor_name: 'Relay',
			user_id: 37,
			detail: [
				{
					id: 1,
					name: 'Pompa',
					value: dumPompa[i],
	                is_control: 1,
	                updated_at: "26/01/2018, 02:51 WIB",
	                secret_code: "abc"
				}
			]
		},
	];

}
	begin = false;
	callback();
}

table[0] = [
	{
		id: 1,
		ppm: 6,
		date: "06-01-2017",
		time: "08:30"
	},
	{
		id: 2,
		ppm: 6.6,
		date: "06-01-2017",
		time: "08:40"
	},
	{
		id: 3,
		ppm: 6.7,
		date: "06-01-2017",
		time: "08:50"
	},
	{
		id: 4,
		ppm: 6,
		date: "06-01-2017",
		time: "09:00"
	},
	{
		id: 5,
		ppm: 6.1,
		date: "06-01-2017",
		time: "09:10"
	},
	{
		id: 6,
		ppm: 6,
		date: "07-01-2017",
		time: "08:00"
	},
	{
		id: 7,
		ppm: 6.9,
		date: "07-01-2017",
		time: "08:10"
	},

	{
		id: 8,
		ppm: 6,
		date: "07-01-2017",
		time: "08:20"
	},

];

var report = [
	{
		status: 1,
		date: "2017-01-07",
		time: "08:20",
	},
	{
		status: 0,
		date: "2017-01-07",
		time: "08:50",
	},
	{
		status: 1,
		date: "2017-01-07",
		time: "09:20",
	},
	{
		status: 0,
		date: "2017-01-08",
		time: "08:20",
	},
	{
		status: 1,
		date: "2017-01-08",
		time: "09:20",
	},
];

/*var oke = '';
var detail = [];
var ind = -1;
for(var i=0;i<table[0].length;i++){
	//console.log(table[0][i]);
	if(oke != table[0][i].date){
		ind++;
		detail[ind] = {date: table[0][i].date};
		detail[ind].detail = [];
		oke = table[0][i].date;
	}
	
	detail[ind].detail.push({
		ppm: table[0][i].ppm,
		time: table[0][i].time
	});
}
//console.log(detail);

var point = [];
var label = [];
for(var i=0;i<detail.length;i++){
	label.push(detail[i].date);
	var rate = 0;
	for(var j=0;j<detail[i].detail.length;j++){
		rate += detail[i].detail[j].ppm;
	}
	rate = (rate/detail[i].detail.length).toFixed(2);
	point.push(rate);
}

console.log(point);*/