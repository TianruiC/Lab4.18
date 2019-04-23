d3.json("classData.json").then(function(data)
{
  //console.log(correlation(0,1,data))
  drawQuiz(data)
  drawHW(data)
},function(err){console.log(err);})
var correlationQuiz=function(x,y,data)
{
  var datax=data[x].quizes.map(function(d){return d.grade})
  var datay=data[y].quizes.map(function(d){return d.grade})
  var xmean=d3.mean(datax)
  var ymean=d3.mean(datay)
  var top=d3.sum(datax.map(function(d,i){return (datax[i]-xmean)*(datay[i]-ymean)}))
  var sx=d3.deviation(datax)
  var sy=d3.deviation(datay)
  var r=1/(datax.length-1)*top/(sx*sy)
  //console.log(xmean,ymean,top,sx,sy,r)
  return r;
}
var getALLQuiz=function(data)
{
  var array=[]
  for(i=0;i<data.length;i++){
    for(j=0;j<data.length;j++){
      array.push(correlationQuiz(i,j,data))
    }
  }
  return array
}
var correlationHW=function(x,y,data)
{
  var datax=data[x].homework.map(function(d){return d.grade})
  var datay=data[y].homework.map(function(d){return d.grade})
  var xmean=d3.mean(datax)
  var ymean=d3.mean(datay)
  var top=d3.sum(datax.map(function(d,i){return (datax[i]-xmean)*(datay[i]-ymean)}))
  var sx=d3.deviation(datax)
  var sy=d3.deviation(datay)
  var r=1/(datax.length-1)*top/(sx*sy)
  //console.log(xmean,ymean,top,sx,sy,r)
  return r;
}
var getALLHW=function(data)
{
  var array=[]
  for(i=0;i<data.length;i++){
    for(j=0;j<data.length;j++){
      array.push(correlationHW(i,j,data))
    }
  }
  return array
}
var color=function(int)
{
  var abint=Math.abs(int)
  if(abint>0.6){return '#3182bd'}
  else if(abint>0.3){return '#9ecae1'}
  else{return '#c6dbef'}
}
var drawQuiz=function(data){
  d3.select("body").append("h1").text("Quiz correlation")
  var gap=1
  var array=getALLQuiz(data)
  var people=data.length
  var screen={width:850,height:700}
  var margins = {top: 50, right: 50, bottom: 50, left: 50}
  var height=screen.height-margins.top-margins.bottom
  var width=600
  //console.log(height,width)
  var svg=d3.select("body").append("svg")
            .attr("id","graph")
            .attr("width",screen.width)
            .attr("height",screen.height)
  var plotLand =svg.append("g")
                  .classed("plot",true)
                  .attr("transform","translate("+margins.left+","+margins.top+")");
  var corgraph=plotLand.selectAll("rect")
                      .data(array)
                      .enter()
                      .append("rect")
                      .attr("x",function(d,i){return (i%people)*width/people;})
                      .attr("y",function(d,i){return (Math.floor(i/people))*height/people;})
                      .attr("width",width/people-gap)
                      .attr("height",height/people-gap)
                      .attr("fill",function(d){return color(d)})
                      .on("mouseover",function(d){
                        d3.select(this).attr("stroke","black")
                          .attr("stroke-width",gap)
                        var xPosition = (d3.select(this).attr("x"));
                        var yPosition = (d3.select(this).attr("y"));
                        plotLand.append('rect')
                           .attr("id","tooltipBG")
                           .attr("x",xPosition)
                           .attr("y",yPosition-31)
                           .attr("width",60)
                           .attr("height",30)
                           .style("fill","#EDF0EC")
                        plotLand.append('text')
                           .attr("id","tooltipText")
                           .attr("x",xPosition+10)
                           .attr("y",yPosition-10)
                           .text("r: "+d.toFixed(2))
                           .attr("font-size","20px")
                      })
                      .on("mouseout",function(d){
                        d3.select(this).attr("stroke","none")
                        d3.select("#tooltipBG").remove()
                        d3.select("#tooltipText").remove()
                      })
  var legend1=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+margins.left+","+15+")");
  var legendTop=legend1.selectAll("image")
                        .data(data)
                        .enter()
                        .append("image")
                        .classed("legendPic",true)
                        .attr("transform",function(d,i){return "translate("+((width/people)*i)+","+(screen.height-margins.bottom-15)+")";})
                        .attr("xlink:href", function(d){return d.picture})
                        .attr("width",width/people)
                        .attr("height",height/people)
  var legend2=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+0+","+margins.top+")");
  var legendLeft=legend2.selectAll("image")
                        .data(data)
                        .enter()
                        .append("image")
                        .classed("legendPic",true)
                        .attr("transform",function(d,i){return "translate("+(margins.left-27)+","+((height/people)*i)+")";})
                        .attr("xlink:href", function(d){return d.picture})
                        .attr("width",width/people)
                        .attr("height",height/people)
  var legend3=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+(width+margins.left+40)+","+margins.top+")");
  var textdata=["0<= | r | <=0.3","0.3 <| r | <=0.6","0.6 < | r | <=1"]
  var colordata=["#c6dbef","#9ecae1","#3182bd"]
  var legengcolor=legend3.selectAll("rect")
                         .data(colordata)
                         .enter()
                         .append("rect")
                         .attr("x",0)
                         .attr("y",function(d,i){return 10+30*i;})
                         .attr("width",width/people-gap)
                         .attr("height",height/people-gap)
                         .attr("fill",function(d){return d})
  var legengtext=legend3.selectAll("text")
                         .data(textdata)
                         .enter()
                         .append("text")
                         .attr("x",width/people-gap+2)
                         .attr("y",function(d,i){return 30+30*i;})
                         .text(function(d){return d})
}
var drawHW=function(data){
  d3.select("body").append("h1").text("Homework correlation")
  var gap=1
  var array=getALLHW(data)
  var people=data.length
  var screen={width:850,height:700}
  var margins = {top: 50, right: 50, bottom: 50, left: 50}
  var height=screen.height-margins.top-margins.bottom
  var width=600
  var svg=d3.select("body").append("svg")
            .attr("id","graph")
            .attr("width",screen.width)
            .attr("height",screen.height)
  var plotLand =svg.append("g")
                  .classed("plot",true)
                  .attr("transform","translate("+margins.left+","+margins.top+")");
  var corgraph=plotLand.selectAll("rect")
                      .data(array)
                      .enter()
                      .append("rect")
                      .attr("x",function(d,i){return (i%people)*width/people;})
                      .attr("y",function(d,i){return (Math.floor(i/people))*height/people;})
                      .attr("width",width/people-gap)
                      .attr("height",height/people-gap)
                      .attr("fill",function(d){return color(d)})
                      .on("mouseover",function(d){
                        d3.select(this).attr("stroke","black")
                          .attr("stroke-width",gap)
                        var xPosition = (d3.select(this).attr("x"));
                        var yPosition = (d3.select(this).attr("y"));
                        plotLand.append('rect')
                           .attr("id","tooltipBG")
                           .attr("x",xPosition)
                           .attr("y",yPosition-31)
                           .attr("width",60)
                           .attr("height",30)
                           .style("fill","#EDF0EC")
                        plotLand.append('text')
                           .attr("id","tooltipText")
                           .attr("x",xPosition+10)
                           .attr("y",yPosition-10)
                           .text("r: "+d.toFixed(2))
                           .attr("font-size","20px")
                      })
                      .on("mouseout",function(d){
                        d3.select(this).attr("stroke","none")
                        d3.select("#tooltipBG").remove()
                        d3.select("#tooltipText").remove()
                      })
  var legend1=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+margins.left+","+15+")");
  var legendTop=legend1.selectAll("image")
                        .data(data)
                        .enter()
                        .append("image")
                        .classed("legendPic",true)
                        .attr("transform",function(d,i){return "translate("+((width/people)*i)+","+(screen.height-margins.bottom-15)+")";})
                        .attr("xlink:href", function(d){return d.picture})
                        .attr("width",width/people)
                        .attr("height",height/people)
  var legend2=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+0+","+margins.top+")");
  var legendLeft=legend2.selectAll("image")
                        .data(data)
                        .enter()
                        .append("image")
                        .classed("legendPic",true)
                        .attr("transform",function(d,i){return "translate("+(margins.left-27)+","+((height/people)*i)+")";})
                        .attr("xlink:href", function(d){return d.picture})
                        .attr("width",width/people)
                        .attr("height",height/people)
  var legend3=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+(width+margins.left+40)+","+margins.top+")");
  var textdata=["0<= | r | <=0.3","0.3 <| r | <=0.6","0.6 < | r | <=1"]
  var colordata=["#c6dbef","#9ecae1","#3182bd"]
  var legengcolor=legend3.selectAll("rect")
                         .data(colordata)
                         .enter()
                         .append("rect")
                         .attr("x",0)
                         .attr("y",function(d,i){return 10+30*i;})
                         .attr("width",width/people-gap)
                         .attr("height",height/people-gap)
                         .attr("fill",function(d){return d})
  var legengtext=legend3.selectAll("text")
                         .data(textdata)
                         .enter()
                         .append("text")
                         .attr("x",width/people-gap+2)
                         .attr("y",function(d,i){return 30+30*i;})
                         .text(function(d){return d})
}
