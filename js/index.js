window.onload=function(){
	var node;
	var margin = {top: 0, right: 0, bottom: 0, left: 0};
	var width = (window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth) - margin.left - margin.right;
	var height = (window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight) - margin.top - margin.bottom;
	//scale
	var csize = d3.scaleLinear().range([0,Math.min(width,height)/150]);
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	//sceen
	var svg = d3.select("svg");
    var range = Math.min(width,height)-20;
	//other
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.index }))
        .force("collide",d3.forceCollide( function(d){return csize(d.size) + 10 }).iterations(16) )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter((width)/2, height/2-100))
        .force("y", d3.forceY(0))
        .force("x", d3.forceX(0));
	//data
	d3.json("data/index.json").then(function(data) {
		var link = svg.append("g")
      	.attr("class", "links")
	    .selectAll("line")
	    .data(data.links)
	    .enter().append("line")
	      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

		node = svg.append("g")
		.selectAll(".sum")
		.data(data.nodes,function(d) { return d.id; })
		.enter().append("circle")
			.attr("class", "sum")
			.attr("r", function(d){ return csize(d.size);})
			.call(d3.drag()
	          .on("start", dragstarted)
	          .on("drag", dragged)
	          .on("end", dragended));
		svg.selectAll(".sum")
			.filter(function(d,i){if(d.image!=null) console.log(d.image); return d.image;})
			.append("svg:image")
				.attr("class","resresponsive-img circle")
				.attr("src",d.img);
        svg.selectAll(".sum")
            .filter(function(d,i){if(d.icon!=null) console.log(d.icon); return d.icon;})
            .append("i")
            .attr("class",function(d){
                return "icon fa fa-5x fa-" + d.icon;
            })
            .style(defaultStyle);
		simulation
		  .nodes(data.nodes)
		  .on("tick", ticked);

        simulation.force("link")
            .links(data.links);

		

		function ticked() {
		  	node
		        .attr("cx", function(d) { return d.x = Math.max(csize(d.size), Math.min(width - csize(d.size), d.x)); })
		        .attr("cy", function(d) { return d.y = Math.max(csize(d.size), Math.min(height - csize(d.size)-100, d.y)); })
		        //.attr("fill" , function(d){ return color(d.group)});
		        .attr("fill" , function(d){ return color(d.group)});
		    link
		        .attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });
		  }
	});
	function dragstarted(d) {
	  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	  d.fx = d.x;
	  d.fy = d.y;
	}

	function dragged(d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}

	function dragended(d) {
	  if (!d3.event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}
}