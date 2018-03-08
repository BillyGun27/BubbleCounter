App.include([
	'/bower_components/jquery-slimscroll/jquery.slimscroll.min.js',
	'/bower_components/fastclick/lib/fastclick.js',
	'/bower_components/chart.js/Chart.js',
	'/dist/js/adminlte.min.js',
	'/bower_components/jquery-knob/js/jquery.knob.js',
	'/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js',
	'/App/Public/js/gauge.min.js',
	'/bower_components/moment/min/moment.min.js',
	'/plugins/input-mask/jquery.inputmask.js',
	'/plugins/input-mask/jquery.inputmask.date.extensions.js',
	'/plugins/input-mask/jquery.inputmask.extensions.js',
	'/bower_components/bootstrap-daterangepicker/daterangepicker.js',
	'/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
	'/bower_components/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js',
	'/plugins/timepicker/bootstrap-timepicker.min.js',

], function(){
  	home = new HomeController();
});
//unedited
var home;
var duration = 3000;

var HomeController = function(){
	var transisi = true;
	var menu = App.getHash();
	
	var session = new Session;
  	var service = new Service;

	if(session.get("token")  == null ){
		Redirect.start('/');
	}

		  
	Redirect.startLoading();
	
	var body = '/App/Template/Admin/home.shtml';
	if(menu == 'home')
		body = '/App/Template/Admin/home.shtml';
	else if(menu == 'ghA')
		body = '/App/Template/Admin/ghA.shtml';
	else if(menu == 'ghG')
		body = '/App/Template/Admin/ghG.shtml';

	App.template([
		['#head', '/App/Template/head.shtml'],
		['#body', body],
		['#header', '/App/Template/Admin/header.shtml'],
		['#footer', '/App/Template/footer.shtml'],
		['#side', '/App/Template/Admin/side.shtml'],
	], function(){
		if(menu != 'home' && menu != '') start();
		else {
			$('#xlsForm').attr('action', App.baseAPI() + '/data/upload');
		}
		clickHandle();
		Redirect.stopLoading();
	});

	var dataSensor;
	var sensorDO;
	var statusPompa;

	var loop;
	
	var start = function(){
		drawGraphDO(0);
		drawGraphCompare();

		var ind = 0;
		if(menu == 'ghA')
			ind = 0;
		else if(menu == 'ghG')
			ind = 1;

		startTask();
		getReportData();
		getExcelData(0, 0);
		drawGraphCompare();
		
		loop = setInterval(function(){
			startTask();
		}, duration);
	}

	var startTask = function(){
		getDataDO();
		getDataPompa();
	}

	var clickHandle = function(){

		$('body').click(function(e){
			//$.toaster({ priority : 'success', title : '', message : ''+e.target.id});
			switch(e.target.id){
		      default:
		        break;
		    }
		});

		$( window ).on( 'hashchange', function(e) {
    		rebuild();
		});

		$( '#logout' ).click(function(){
			session.destroy();
			Redirect.start('/');
		});
		

		//Date range as a button
		$('#daterange-btn').daterangepicker(
		  {
		    ranges   : {
		      'Today'       : [moment(), moment()],
		      'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		      'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
		      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
		      'This Month'  : [moment().startOf('month'), moment().endOf('month')],
		      'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		    },
		    startDate: moment(),
		    endDate  : moment()
		  },
		  function (start, end) {
		  	if(start.format('DD/MM/YYYY') == end.format('DD/MM/YYYY')){
			    $('#daterange-btn span').html(start.format('DD/MM/YYYY'))	
		  	}
		  	else{
		   	 	$('#daterange-btn span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'))
		  	}

		  	getExcelData(start.format('MM/DD/YY'), end.format('MM/DD/YY'));
		  }
		)
	}

	var rebuild = function(){
		clearInterval(loop);
		$('body').unbind('click');
		if(transisi){
			transisi = false;
			setTimeout(function() { home = new HomeController; }, 100);
		}
	}

	
	var getDataPompa = function(){
		var currentValue = 0;

		service.start({
	      type: 'get', 
	      uri: App.baseAPI() + '/data/pompa',
	      timeout: 60000,
	      loading: false
	    }, function(){

	      if(service.isSuccessful()){
	        var data = service.response();
	        if(data != null && data.length > 0){
	        	currentValue = parseInt(data[0].status_mesin);
	        	
	        	var status = (data[0].value) ? 'ON' : 'OFF';
				var color = (data[0].value) ? 'green' : 'red';

				var pompa = document.getElementById('stPompa');
				pompa.innerHTML = status;
				pompa.style.backgroundColor = color;
			}
	      }

    	});
		
	}

	var getDataDO = function(){
		var currentValue = 0;

		service.start({
	      type: 'get', 
	      uri: App.baseAPI() + '/data/meteran',
	      timeout: 60000,
	      loading: false
	    }, function(){

	      if(service.isSuccessful()){
	        var data = service.response();
	        if(data != null && data.length > 0){
	        	currentValue = parseFloat(data[0].do_value);
	        	
	        }
	        //$('#container-pHSensor').html(container);
			$('#preview-DOSensor').html("<span style='font-size:24px;font-weight:bold'>" + currentValue.toFixed(2) + "</span> ppm");
			gaugeDO.set(currentValue);
	      }

    	});
	}

	var gaugeDO; 
	var drawGraphDO = function(currentValue, maxValue = 10){
		var opts = {
		  angle: 0, // The span of the gauge arc
		  lineWidth: 0.14, // The line thickness
		  radiusScale: 0.9, // Relative radius
		  pointer: {
		    length: 0.4, // // Relative to gauge radius
		    strokeWidth: 0.031, // The thickness
		    color: '#000000' // Fill color
		  },
		  limitMax: true,     // If false, max value increases automatically if value > maxValue
		  limitMin: true,     // If true, the min value of the gauge will be fixed
		  strokeColor: '#E0E0E0',  // to see which ones work best for you
		  generateGradient: true,
		  highDpiSupport: true,     // High resolution support
		   
		  renderTicks: {
		    divisions: 10,
		    divWidth: 0.6,
		    divLength: 0.5,
		    divColor: 'blue',
		    subDivisions: 20,
		    subLength: 0,
		    subWidth: 0.1,
		    subColor: '#666666'
		  },
		  staticZones: [
		   {strokeStyle: "#FFDD00", min: 0, max: 3}, // Yellow
		   {strokeStyle: "#30B32D", min: 3, max: 7}, // Green
		   {strokeStyle: "#F03E3E", min: 7, max: 10},  // Red
		   //{strokeStyle: "#F03E3E", min: 10, max: 20}  // Red
		  ],
		  staticLabels: {
			font: "14px sans-serif",  // Specifies font
			labels: [0, 3, 7, 10],  // Print labels at these values
			color: "#fff",  // Optional: Label text color
			fractionDigits: 0  // Optional: Numerical precision. 0=round off.
		  },
		};

		var target = document.getElementById('DOSensor'); // your canvas element
		//target.removeAttribute("style");
		gaugeDO = new Gauge(target).setOptions(opts); // create sexy gauge!
		//target.style = 'width: 100%';
		gaugeDO.maxValue = maxValue; // set max gauge value
		gaugeDO.animationSpeed = 1; // set animation speed (32 is default value)
		
		gaugeDO.set(currentValue); // set actual value
	}

	var getReportData = function(){
		
		service.start({
	      type: 'get', 
	      uri: App.baseAPI() + '/data/mesin',
	      timeout: 60000,
	      loading: false
	    }, function(){

	      if(service.isSuccessful()){
	        var data = service.response();
	        if(data != null){
	    		drawTable(data);    	
	        }
	      }

    	});
	}

	var drawTable = function(data){
		var container = $('#dataTables');
		var templateFoot = ''+
					   '</table>'+
                  	'</div>'+
                  '</div>'+
                '</div>'
                +'';
			var templateHead = '' +
			'<div class="col-xs-12">' +
                '<div class="box">' +
                  '<div class="box-header">' +
                    '<h3 class="box-title">Report ' + 1 + '</h3>' +
                  '</div>'+
                  '<div class="box-body table-responsive no-padding">'+
                    '<table class="table table-hover" id="table0">'+
                      '<tr>'+
                        '<th rowspan="2" style="text-align:center">No</th>'+
                        '<th colspan="3" style="text-align:center">Awal</th>'+
                        '<th colspan="3" style="text-align:center">Akhir</th>'+
                        '<th rowspan="2" style="text-align:center">Durasi</th>'+
                       '</tr>' +
                       '<tr>'+
                        '<th>Status</th>'+
                        '<th>Date</th>'+
                        '<th>Time</th>'+
                        '<th>Status</th>'+
                        '<th>Date</th>'+
                        '<th>Time</th>'+
                       '</tr>'
			+ '';

			var templateBody = '';

			var txStatusAwal, txStatusAkhir;
			var bgStatusAwal, bgStatusAkhir;
			var selisih;

			for(var j = 0; j < data.length; j++){

				if(data[j].status_awal == 0){
					bgStatusAwal = 'danger';
					txStatusAwal = 'off';
				}
				else if(data[j].status_awal == 1){
					bgStatusAwal = 'success';
					txStatusAwal = 'on';
				}
				if(data[j].status_akhir == 0){
					bgStatusAkhir = 'danger';
					txStatusAkhir = 'off';
				}
				else if(data[j].status_akhir == 1){
					bgStatusAkhir = 'success';
					txStatusAkhir = 'on';
				}

				selisih = data[j].diff 

				templateBody += ''+
					'<tr>'+
						'<td>' + (j+1) + '</td>'+
						'<td><span class="label label-'+ bgStatusAwal +'">' + txStatusAwal + '</span></td>'+
						'<td>' + data[j].date_awal + '</td>'+
						'<td>' + data[j].time_awal + '</td>'+
						'<td><span class="label label-'+ bgStatusAkhir +'">' + txStatusAkhir + '</span></td>'+
						'<td>' + data[j].date_akhir + '</td>'+
						'<td>' + data[j].time_akhir + '</td>'+
						'<td>' + selisih + '</td>'+
						//'<td><span class="label label-'+ bgStatus +'">' + txStatus + '</span></td>'+
						//'<td>' + data[i][j].tgl_semai + '</td>'+
						//'<td>' + data[i][j].prediksi_panen + '</td>'+
						//'<td>' + data[i][j].realisasi_panen + '</td>'+
					'</tr>'
				+'';
			}

			var contain = templateHead + templateBody + templateFoot;
			container.append(contain)

		
	}


	var excelData;
	var getExcelData = function(min, max){
		//min = "12/21/17";
		//max = "12/21/17"; 
		
		var data = {
			min: min,
			max: max
		};

		service.start({
	      type: 'get',
	      data: data, 
	      uri: App.baseAPI() + '/data/xls',
	      timeout: 60000,
	      loading: false
	    }, function(){

	      if(service.isSuccessful()){
	        excelData = service.response();
	        getMesinData(min,max);
	        //console.log(excelData);
	      }

    	});
	}

	var mesinData;
	var getMesinData = function(min, max){
		//min = "02/13/18";
		//max = "02/13/18"; 
		
		var data = {
			min: min,
			max: max
		};

		service.start({
	      type: 'get',
	      data: data, 
	      uri: App.baseAPI() + '/data/sensor',
	      timeout: 60000,
	      loading: false
	    }, function(){

	      if(service.isSuccessful()){
	        mesinData = service.response();
	        //console.log(mesinData);
	      }

	      if(excelData != null && mesinData != null){
	      	if(min == max){
	      		setGraphCompareToday();
	      	}
	      	else{
	      		setGraphCompare();
	      	}
	      }
	 
    	});
	}

	
	var graphCompare;	
	var drawGraphCompare = function(){
	    var lineChartData = {
	      labels  : [],
	      datasets: [
	        {
	          label               : 'Data Sensor',
	          backgroundColor 	  : '#003bff',
              borderColor         : '#003bff',
              fill                : false,
              pointRadius         : 0,
              pointHitRadius      : 30,
	          data                : [] //point
	        },
	        {
	          label               : 'Data Excel',
	          backgroundColor 	  : '#00e5ff',
              borderColor         : '#00e5ff',
              fill                : false,
              pointRadius         : 0,
              pointHitRadius      : 30,
	          data                : []
	        }
	      ]
	    };

	    var lineChartOptions = {
	      showScale               : true,
	      scaleShowGridLines      : false,
	      scaleGridLineColor      : 'rgba(0,0,0,.05)',
	      scaleGridLineWidth      : 1,
	      scaleShowHorizontalLines: true,
	      scaleShowVerticalLines  : true,
	      bezierCurve             : true,
	      bezierCurveTension      : 0.3,
	      pointDot                : false,
	      pointDotRadius          : 5,
	      pointDotStrokeWidth     : 1,
	      pointHitDetectionRadius : 20,
	      datasetStroke           : true,
	      datasetStrokeWidth      : 2,
	      datasetFill             : false,
	      legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].lineColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
	      maintainAspectRatio     : true,
	      responsive              : true,

	      scales: {
		    yAxes: [{
		      scaleLabel: {
		        display: true,
		        labelString: 'Dissolved Oxygen (ppm)'
		      }
		    }],
		    xAxes: [{
		      scaleLabel: {
		        display: true,
		        labelString: 'Date / Time'
		      }
		    }]
		  },

		  tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
	    };

	    //-------------
	    //- LINE CHART -
	    //--------------
		var lineChartCanvas          = $('#lineChart').get(0).getContext('2d');
		graphCompare = new Chart(lineChartCanvas, {
		    type: 'line',
		    data: lineChartData,
		    options: lineChartOptions
		});
	}

	var updateGraphCompare = function(label = [], value = []){
		graphCompare.data.labels = label;
		for(var i=0; i<value.length; i++){
			graphCompare.data.datasets[i].data = value[i];
		}
		graphCompare.update();
	}

	var setGraphCompare = function(){
		var detail = {
			xls: [],
			mesin: []
		};
		var point = {
			xls: [],
			mesin: []
		};
		var label = {
			xls: [],
			mesin: []
		};
		var finalLabel = [];
		
		var temp;
		var ind;

		ind = -1;
		temp = '';
		for(var i=0; i<excelData.length; i++){
			if(temp != excelData[i].date){
				ind++;
				detail.xls[ind] = {date: excelData[i].date};
				detail.xls[ind].detail = [];
				temp = excelData[i].date;
			}
			
			detail.xls[ind].detail.push({
				ppm: excelData[i].ch1_value,
				time: excelData[i].time
			});
		}

		//console.log(detail.xls);
		for(var i=0;i<detail.xls.length;i++){
			label.xls.push(detail.xls[i].date);
			var rate = ppmRate(detail.xls[i].detail);
			point.xls.push(rate);
		}

		ind = -1;
		temp = '';
		for(var i=0; i<mesinData.length; i++){
			if(temp != mesinData[i].receive_date){
				ind++;
				detail.mesin[ind] = {date: mesinData[i].receive_date};
				detail.mesin[ind].detail = [];
				temp = mesinData[i].receive_date;
			}
			
			detail.mesin[ind].detail.push({
				ppm: mesinData[i].do_value,
				time: mesinData[i].receive_time
			});
		}

		//console.log(detail.mesin);
		for(var i=0;i<detail.mesin.length;i++){
			label.mesin.push(detail.mesin[i].date);
			
			var rate = ppmRate(detail.mesin[i].detail);
			point.mesin.push(rate);
		}

		if(label.xls.length > label.mesin.length){
			finalLabel = label.xls;
		}
		else{
			finalLabel = label.mesin;	
		}

		console.log(point);
		updateGraphCompare(finalLabel, [
			point.mesin,
			point.xls
		]);
	}

	var ppmRate = function(arr = []){
		var rate = 0;
		for(var i=0; i<arr.length; i++){
			rate += parseInt(arr[i].ppm);
		}
		return (rate/arr.length).toFixed(2);
	}

	var setGraphCompareToday = function(){
		var detail = {
			xls: [],
			mesin: []
		};
		var point = {
			xls: [],
			mesin: []
		};
		var label = {
			xls: [],
			mesin: []
		};
		var finalLabel = [];
		
		var temp;
		var ind;

		ind = -1;
		temp = '';
		for(var i=0; i<excelData.length; i++){
			var waktu = excelData[i].time.split(':', 1)[0];
			if(temp != waktu){
				ind++;
				detail.xls[ind] = {date: waktu};
				detail.xls[ind].detail = [];
				temp = waktu;
			}
			
			detail.xls[ind].detail.push({
				ppm: excelData[i].ch1_value,
				time: excelData[i].time
			});
		}

		console.log(detail.xls);
		for(var i=0;i<detail.xls.length;i++){
			label.xls.push(detail.xls[i].date);
			var rate = ppmRate(detail.xls[i].detail);
			point.xls.push(rate);
		}

		ind = -1;
		temp = '';
		for(var i=0; i<mesinData.length; i++){
			var waktu = mesinData[i].receive_time.split(':', 1)[0];
			if(temp != waktu){
				ind++;
				detail.mesin[ind] = {date: waktu};
				detail.mesin[ind].detail = [];
				temp = waktu;
			}
			
			detail.mesin[ind].detail.push({
				ppm: mesinData[i].do_value,
				time: mesinData[i].receive_time
			});
		}

		console.log(detail.mesin);
		for(var i=0;i<detail.mesin.length;i++){
			label.mesin.push(detail.mesin[i].date);
			
			var rate = ppmRate(detail.mesin[i].detail);
			point.mesin.push(rate);
		}

		if(label.xls.length > label.mesin.length){
			finalLabel = label.xls;
		}
		else{
			finalLabel = label.mesin;	
		}

		updateGraphCompare(finalLabel, [
			point.mesin,
			point.xls
		]);
	}
}