"use strict";
// V0.0.1 
// Untested.
// For using in upcoming projects.
function MMath(){
    // Desc: formats a number
    // Arguments:
    // Returns:
    //    new mmath object
    // Notes:
    //    This libarry is designed for fast realtime apps and thus it make attempts
    //    to avoid garbage collection. Provides access to intermediate results, and
    //    uses inline code rather than calling existing functions. This means that 
    //    there is a lot of redundent code.
    //    
    
    // Result of a point operation
    this.pointResult = {x:0,y:0};  // point result
    // Result of a poitn operation
    this.X = 0;
    this.Y = 0;

    this.matResult = {             // matrix result
        xdx:0,
        xdy:0,
        ydx:0,
        ydy:0,
    }

    // holds the length of any vectors
    this.dist1 = 0;    // lengths of input vectors
    this.dist2 = 0;

    // holds the square of any vector lengths
    this.distSqr1 = 0;  // squared length
    this.distSqr2 = 0;

    // holds the normalised vectors
    this.nx1 = 0;      // normalised input vectors
    this.ny1 = 0;
    this.nx2 = 0;
    this.ny2 = 0;
    
    // holds the dot product
    this.dot1 = 0;      // dot product;
    this.dot2 = 0;      // dot product;
    
    // holds the cross product
    this.cross1 = 0;    // cross product;
    this.cross2 = 0;    // cross product;
    
    // holds the angle if calculated
    this.angle;  // angle if avalible
    
    //// where on the line a line calc landed
    this.lineSegPos;
    
}
MMath.prototype.formatNumber = function(val,format){
    // Desc: formats a number
    // Arguments:
    //    val: the number to be formated
    //    format: A string describing the format
    // Returns:
    //    formated number as a string
    // Notes:
    //    Part of the math functions but needs to be removed
    var e = 0;
    var preFix = "";
    var postFix = "";
    var d = format.indexOf(".");
    if(d > -1){
        var e = format.lastIndexOf("#");
        if(e > -1){
             e = e-d;
        }
        
    }
    if(format.indexOf("%")>-1){
        val = val * 100;
        postFix = "%";
    }
    if(format.indexOf("$")>-1){
        e = 2;
        preFix = "$";
    }
    if(format.indexOf(",")>-1){
        var n = Math.abs(val).toFixed(e);
        if(e > 0){
            var l = n.length-e;
            var nn = n.substr(l);
            l -= 1;
        }else{
            var l = n.length -1;
            var nn = "";
        }
        var c = 0;
        while(l >= 0){
            nn = n[l]+nn;
            if(c === 3 && l !== 0){
                c = 0;
                nn = ","+nn;
            }
            c += 1;
            l -= 1;
        }
        return preFix+(val <0?"-":"")+nn+postFix;
            
            
    }
    return preFix+val.toFixed(e)+postFix;

}
MMath.prototype.point = function(x,y){
    // Desc: Creates a point
    // Arguments:
    //    x amd y;
    // Returns:
    //    {x:Number,y:Number}
    // Notes:
    //    
    return {x:x,y:y};
}
MMath.prototype.intersect = function(x1,y1,x2,y2,x3,y3,x4,y4){
    // Desc: Get the intersection point of two lines
    // Arguments:
    //    x1,y1,x2,y2: First line.
    //    x3,y2,x4,y4: Second line
    // Returns:
    //    {x:Number,y:Number}
    // Notes:
    //    Also creates the cross production of both lines
    var x12, x34, y12, y34, a, b, c;
    x12 = x1 - x2;
    x34 = x3 - x4;
    y12 = y1 - y2;
    y34 = y3 - y4;

    c = x12 * y34 - y12 * x34;

    if (Math.abs(c) < 0.0001){
        return undefined;
    }
    this.cross1 = a = x1 * y2 - y1 * x2;
    this.cross2 = b = x3 * y4 - y3 * x4;

    this.X = this.pointResult.x = (a * x34 - b * x12) / c;
    this.Y = this.pointResult.y = (a * y34 - b * y12) / c;

    return this.pointResult;

}
MMath.prototype.intersectSeg = function(x1,y1,x2,y2,x3,y3,x4,y4){
    // Desc: Get the intersection point of two lines only if its on the line
    // Arguments:
    //    x1,y1,x2,y2: First line.
    //    x3,y2,x4,y4: Second line
    // Returns:
    //    {x:Number,y:Number}
    // Notes:
    //    Creates the cross production of both lines
    //    this.X, this.Y hold the intersection if found of the lines.
    //    this.dist1 the length of the first line

    var x12, x34, y12, y34, a, b, c, d1, d2;

    x12 = x1 - x2;
    x34 = x3 - x4;
    y12 = y1 - y2;
    y34 = y3 - y4;

    c = x12 * y34 - y12 * x34;

    if (Math.abs(c) < 0.0001){
        return undefined;
    }
    this.cross1 = a = x1 * y2 - y1 * x2;
    this.cross2 = b = x3 * y4 - y3 * x4;

    this.X = (a * x34 - b * x12) / c;
    this.Y = (a * y34 - b * y12) / c;
    
    // This needs to be fixed and done the correct way
    this.dist1 = d1 = Math.sqrt(x12*x12+y12*y12);
    d2 = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
    if(d2 > d1){
        return undefined;
    }
    d2 = Math.sqrt((x2-x)*(x2-x)+(y2-y)*(y2-y));
    if(d2 > d1){
        return undefined;
    }

    this.pointResult.x = x;
    this.pointResult.y = y;

    return this.pointResult;

}
MMath.prototype.intersectNew = function(x1,y1,x2,y2,x3,y3,x4,y4){
    // Desc: Get the intersection point of two lines
    // Arguments:
    //    x1,y1,x2,y2: First line.
    //    x3,y2,x4,y4: Second line
    // Returns:
    //    {x:Number,y:Number}
    // Notes:
    //    Also creates the cross production of both lines
    
    var x12, x34, y12, y34, a, b, c;
    x12 = x1 - x2;
    x34 = x3 - x4;
    y12 = y1 - y2;
    y34 = y3 - y4;

    c = x12 * y34 - y12 * x34;

    if (Math.abs(c) < 0.0001){
        return undefined;
    }
    this.cross1 = a = x1 * y2 - y1 * x2;
    this.cross2 = b = x3 * y4 - y3 * x4;   
    
    this.pointResult = {x:(a * x34 - b * x12) / c, y:(a * y34 - b * y12) / c};

    return this.pointResult;

}
MMath.prototype.intersectP = function(p1,p2,p3,p4){
    // Desc: Get the intersection point of two lines input as points
    // Arguments:
    //    p1,p2: First line.
    //    p2,p4: Second line
    // Returns:
    //    {x:Number,y:Number}
    // Notes:
    //    Also creates the cross production of both lines    
    var x12, x34, y12, y34, a, b, c;
    x12 = p1.x - p2.x;
    x34 = p3.x - p4.x;
    y12 = p1.y - p2.y;
    y34 = p3.y - p4.y;

    c = x12 * y34 - y12 * x34;

    if (Math.abs(c) < 0.00001){
        return undefined;
    }
    this.cross1 = a = p1.x * p2.y - p1.y * p2.x;
    this.cross2 = b = p3.x * p4.y - p3.y * p4.x;

    this.X = this.pointResult.x = (a * x34 - b * x12) / c;
    this.Y = this.pointResult.x = (a * y34 - b * y12) / c;

    return this.pointResult;

}
MMath.prototype.intersectPNew = function(p1,p2,p3,p4){
    // Desc: Get the intersection point of two lines input as points
    //       creates a new point.
    // Arguments:
    //    p1,p2: First line.
    //    p2,p4: Second line
    // Returns:
    //    {x:Number,y:Number}
    // Notes:
    //    Also creates the cross production of both lines    
    var x12, x34, y12, y34, a, b, c;
    x12 = p1.x - p2.x;
    x34 = p3.x - p4.x;
    y12 = p1.y - p2.y;
    y34 = p3.y - p4.y;

    c = x12 * y34 - y12 * x34;

    if (Math.abs(c) < 0.00001){
        return undefined;
    }
    this.cross1 = a = p1.x * p2.y - p1.y * p2.x;
    this.cross2 = b = p3.x * p4.y - p3.y * p4.x;

    this.pointResult = {
        x:( this.X = (a * x34 - b * x12) / c),
        y:( this.Y = (a * y34 - b * y12) / c)
    };

    return this.pointResult;

}
MMath.prototype.normalize = function(x1,y1,x2,y2){
    this.X = x2-x1;
    this.Y = y2-y1;
    this.dist1 = Math.sqrt(this.X*this.X+this.Y*this.Y);
    if(this.dist1 > 0){
        this.nx1 = this.pointResult.x = this.X/this.dist1;
        this.nx2 = this.pointResult.y = this.Y/this.dist1;
        return this.pointResult;
    }
    return undefined;
}
MMath.prototype.distPointToLine = function (x, y, x1, y1, x2, y2) {
    var px = x2 - x1;
    var py = y2 - y1;
    var u = this.lineSegPos = Math.max(0, Math.min(1, ((x - x1) * px + (y - y1) * py) / (this.distSqr1 = (px * px + py * py))));
    return Math.sqrt(Math.pow((x1 + u * px) - x, 2) + Math.pow((y1 + u * py) - y, 2));
}
MMath.prototype.getClosestPointOnLine= function(x1,y1,x2,y2,x,y,clamp){
    var abx, aby, apx, apy, u;
    abx = x2-x1;
    aby = y2-y1;
    if(abx === 0 && aby === 0){
        return [x1,y1];
    }
    apx = x-x1;
    apy = y-y1;
    u = this.lineSegPos = (apx*abx + apy*aby) / (abx*abx + aby*aby);
    if (clamp ){
        u = Math.max(0,Math.min(1,u));
    }
    return [x1+abx*u,y1+aby*u];
}
MMath.prototype.clamp = function(val,min,max){
    return Math.min(max,Math.max(min.val));        
}
MMath.prototype.randomBell = function(amount){
    // Desc: returns a number distributed over a bell curve. 
    // Arguments:
    //    amount: >= 1 and only int's the distribution of the random val. 1 = no curve, 2 slightly like a bell curve
    //           
    var val = Math.random();
    amount = Math.round(Math.max(1,amount));
    for(var i = 1; i < amount; i++){
        val += Math.random();
    }
    return val / amount;  
}
MMath.prototype.getClosestUnitOnLine = function(x1,y1,x2,y2,x,y,clamp){
    // Desc: Gets the closest point on a line in normalised unit
    // Arguments:
    //    x1,y1: start of line
    //    x2,y2: end of line
    //    clamp: If true then clamps to the ends of line.
    // Returns:
    //    Number unit distance on the line 0-1 start to end,
    // Notes: Also sets lineSegPos to result

    var abx, aby, apx, apy, u;
    abx = x2-x1;
    aby = y2-y1;
    if(abx === 0 && aby === 0){
        return [x1,y1];
    }
    apx = x-x1;
    apy = y-y1;
    u = this.lineSegPos = (apx*abx + apy*aby) / (abx*abx + aby*aby);
    if (clamp ){
        u = Math.max(0,Math.min(1,u));
    }
    return u;
}
MMath.prototype.invert2DMatrix = function(xdx,xdy,ydx,ydy){
    var det = (xdx * ydy - xdy * ydx);
    this.matResult.xdx = ydy / det;
    this.matResult.xdy =  - xdy / det;
    this.matResult.ydx =  - ydx / det;
    this.matResult.ydy = xdx / det;    
    return this.matResult;
}
MMath.prototype.invert2DMatrixObj = function(mat){
    var det = (mat.xdx * mat.ydy - mat.xdy * mat.ydx);
    this.matResult.xdx = mat.ydy / det;
    this.matResult.xdy =  - mat.xdy / det;
    this.matResult.ydx =  - mat.ydx / det;
    this.matResult.ydy = mat.xdx / det;    
    return this.matResult;
}
MMath.prototype.multiply2Mat = function(x,y,mat){
    this.pointResult.x = x*mat.xdx + y*mat.ydx;
    this.pointResult.y = x*mat.xdy + y*mat.ydy;
    return this.pointResult;
    
}
MMath.prototype.dotProduct = function(x, y, xx, yy) {
    // warning internal distance erroniouse if lenth 0
   this.dist1 = Math.sqrt(x * x + y * y);
   if (this.dist1  > 0) {
      this.nx1 = x = x / this.dist1 ;
      this.ny1 = y = y / this.dist1 ;
   }else {
      this.nx1 = x = 1;
      this.ny1 = y = 0;
     // this.dist1 = 1;
   }
   this.dist2  = Math.sqrt(xx * xx + yy * yy);
   if (this.dist2  > 0) {
      this.nx2 = xx = xx / this.dist2;
      this.ny2 = yy = yy / this.dist2;
   }else {
      this.nx2 = xx = 1;
      this.ny2 = yy = 0;
      //this.dist2 = 1;
   }
   this.dot = x * xx + y * yy;
   return this.dot;
}
MMath.prototype.dotAngle = function(x, y, xx, yy) {
    // warning internal distance erroniouse if lenth 0
   this.dist1 = Math.sqrt(x * x + y * y);
   if (this.dist1  > 0) {
      this.nx1 = x = x / this.dist1 ;
      this.ny1 = y = y / this.dist1 ;
   }else {
      this.nx1 = x = 1;
      this.ny1 = y = 0;
     // this.dist1 = 1;
   }
   this.dist2  = Math.sqrt(xx * xx + yy * yy);
   if (this.dist2  > 0) {
      this.nx2 = xx = xx / this.dist2;
      this.ny2 = yy = yy / this.dist2;
   }else {
      this.nx2 = xx = 1;
      this.ny2 = yy = 0;
      //this.dist2 = 1;
   }
   this.angle = Math.acos( this.dot = (x * xx + y * yy ));
   
   return this.angle;
}
MMath.prototype.dot = function (x, y, xx, yy) {
    this.dot = x * xx + y * yy;
	return this.dot;
};
MMath.prototype.cross = function (x, y, xx, yy) {
    this.cross = (x * yy) - (y * xx );
	return this.cross;
};
MMath.prototype.clipLineToLine = function(x1,y1,x2,y2,x3,y3,x4,y4){
    // clip line segment (x3,y3) to (x4,y4) on line (x1,y1) - (x2,y2)
    // line is clipped to the right of the cipping line;
    // returns result containing 
    //  clip: two points representing the clipped line
    //  clipped: true if the line has been clipped
    //  outside: true if the clipped point is outside the line segment (x1,y1)-(x2,y2)
    //           only has meaning if result.clipped is true;
    
    var x34, y34, cross1, cross2, result, dist, endToClip, c, b;
    result = {
        clip:[{x:x3,y:y3},{x:x4,y:y4}],
        clipped:false,
        outside:undefined
    };
    if((x2 === x1 && y2 === y1) || (x3 === x4 && y3 === y4)){
        return result; // one of the lines has no length so no clipping possible
    }
    x2 -= x1;
    y2 -= y1;
    x3 -= x1;
    y3 -= y1;
    x4 -= x1;
    y4 -= y1;
    var x34 = x4-x3;
    var y34 = y4-y3;

    cross1 = x2 * y3 - y2 * x3;   // get cross product. cross will be negative if line is left of clipping line
    cross2 = x2 * y4 - y2 * x4;
    // check if both ends of the clipped line are on the same side of the clipping line
    if((cross1 < 0 && cross2 < 0) || (cross1 > 0 && cross2 > 0)){
        // lines segments do not intersect so no clipping 
        return result;        
    }
    dist = Math.sqrt(x2*x2+y2*y2);
    endToClip = 0;   // assume start of clipped line is to the left
    if(cross1 > 0){
        endToClip = 1; // end of clipped line is left of clipping line
    }
    c = x2 * y34 - y2 * x34;  // get cross product of both lines
    b = x3 * y4 - y3 * x4;  // cross product of clipped lines
    // c will be zero if lines are parallel but that would have been vetted above
    // so now set the intersection as the clipping point;
    // reuse x34 and y34 to hold the intercept
    x34 = (b * x2) / c + x1;
    y34 = (b * y2) / c + y1;    
    // reuse cross1 and cross2 and find distance of intercept to ends of clipping line        
    cross1 = Math.sqrt(Math.pow(x1-x34,2) + Math.pow(y1-y34,2));  // distance to start
    cross2 = Math.sqrt(Math.pow((x2+x1)-x34,2) + Math.pow((y1+y2)-y34,2)); // distance to end
    // if distance to either end is greater then the clipping line length then no intercept
    if(cross1 < dist && cross2 < dist){
        result.outside = false; // line segments do cross
    }else{
        result.outside = true; // line segments do not cross
    }
    // set the intercept as the clip
    result.clip[endToClip].x = x34;
    result.clip[endToClip].y = y34;
    result.clipped = true
    return result;    
    
}
MMath.prototype.clipLineToBox = function(x1,y1,x2,y2,top,left,bottom,right){
    // clip line (x1,y1) to (x2,y2) to be inside a box defined as top,left, bottom,right
    // returns undefined if the box is not two dimensional or line is outside
    // returns array of two points representing the clipped line.
    var width, height, clip;
    // check if the line is inside
    if((x1 < left && x2 < left) || (x1 > right && x2 > right) || (y1 < top && y2 < top) || (y1 > bottom && y2 > bottom)){
        return undefined; // line segment is outside the box;
    }
    width = right-left;
    if(width === 0){ //  not a box if it does not have a width
        return undefined;
    }
    height = bottom-top;
    if(height === 0){ //  not a box if it does not have a height
        return undefined;
    }
    clip = this.clipLineToUnitBox((x1-left)/width,(y1-top)/height,(x2-left)/width,(y2-top)/height);
    if(clip !== undefined){ // make sure it has not been clipped out
        // rescale back to original 
        clip[0].x = clip[0].x*width + left; 
        clip[0].y = clip[0].y*height + top; 
        clip[1].x = clip[1].x*width + left; 
        clip[1].y = clip[1].y*height + top; 
        return clip;
    }
    return undefined;    
}
MMath.prototype.clipLineToUnitBox = function(x1,y1,x2,y2){
    // clip line (x1,y1) to (x2,y2) to be inside a unit box top left 0,0 bottom right 1,1
    // returns undefined if the line is outside
    // returns array of two points representing the clipped line.    
    var clip, m;
    clip = [{x:x1,y:y1},{x:x2,y:y2}]
    if((x1 < 0 && x2 < 0) || (x1 > 1 && x2 > 1) || (y1 < 0 && y2 < 0) || (y1 > 1 && y2 > 1)){
        return undefined; // line segment is outside the box;
    }
    if(x1 === x2){ // vertical line 
        clip[0].y = y1 < 0 ? 0 : (y1 > 1 ? 1 : y1); // clip start
        clip[1].y = y2 < 0 ? 0 : (y2 > 1 ? 1 : y2); // clip end;
        return clip;
    }
    if(y1 === y2){ // horizontal line 
        clip[0].x = x1 < 0 ? 0 : (x1 > 1 ? 1 : x1); // clip start
        clip[1].x = x2 < 0 ? 0 : (x2 > 1 ? 1 : x2); // clip end;
        return clip;
    }
    if(x1 < x2){ // line from left to right;
        m = (y1-y2)/(x1-x2);
        if(x1 < 0 && x2 >= 0){  // clip left
            clip[0].x = 0;
            clip[0].y = y1+(-x1*m);
            if(x2 > 1){         // clip right
                clip[1].x = 1;
                clip[1].y = y1 + (1-x1)*m;
            }
        }else
        if(x1 <= 1 && x2 > 1){ // clip right
            clip[1].x = 1;
            clip[1].y = y1 + (1-x1)*m;
        }
    }else{// line from right to left
        m = (y2-y1)/(x2-x1);
        if(x2 < 0 && x1 >= 0){  // clip left
            clip[1].x = 0;
            clip[1].y = y2+(-x2*m);
            if(x1 > 1){       // clip right
                clip[0].x = 1;
                clip[0].y = y2 + (1-x2)*m;
            }
        }else
        if(x2 <= 1 && x1 > 1){ // clip right
            clip[0].x = 1;
            clip[0].y = y2 + (1-x2)*m;
        }
    }   
    // line is now clipped to left and right sides. 
    // if the top and bottom are inside then done
    if(clip[0].y >= 0 && clip[0].y <= 1 && clip[1].y >= 0 && clip[1].y <=1){ 
        return clip;
    }
    // new clip line may be outside the box;
    if((clip[0].y < 0 && clip[1].y < 0) || (clip[0].y > 1 && clip[1].y > 1)){ 
        return undefined; // outside  box so return undefined
    }
    x1 = clip[0].x; // prep to clip to and bottom;
    y1 = clip[0].y;
    x2 = clip[1].x;
    y2 = clip[1].y;

    if(y1 < y2){ // line from top to bottom;
        m = (x1-x2)/(y1-y2);
        if(y1 < 0 && y2 >= 0){  // clip top
            clip[0].x = x1+(-y1*m);
            clip[0].y = 0;
            if(y2 > 1){         // clip bottom
                clip[1].x = x1 + (1-y1)*m;
                clip[1].y = 1;
            }
        }else
        if(y1 <= 1 && y2 > 1){ // clip bottom
            clip[1].x = x1 + (1-y1)*m;
            clip[1].y = 1;
        }
    }else{ // line from bottom to top
        m = (x2-x1)/(y2-y1);
        if(y2 < 0 && y1 >= 0){  // clip top
            clip[1].x = x2+(-y2*m);
            clip[1].y = 0;
            if(y1 > 1){       // clip bottom
                clip[0].x = x2 + (1-y2)*m;
                clip[0].y = 1;
            }
        }else
        if(y2 <= 1 && y1 > 1){ // clip bottom
            clip[0].x = x2 + (1-y2)*m;
            clip[0].y = 1;
        }
    }   
    
    // all done
    return clip;
}

MMath.prototype.createCurve = function(curveData){  // creates a Curve from a set oof points
    if(this.curves === undefined){
        this.curves = [];
    }
    curveData.sort(function(a,b){
        return a.x-b.x;
    });
    var maxX = Number.MIN_VALUE;
    var maxY = Number.MIN_VALUE;
    var minX = Number.MAX_VALUE;
    var minY = Number.MAX_VALUE;
    for(var i = 0; i < curveData.length; i ++){
        if(i < curveData.length-1){
            if(curveData[i].x === curveData[i+1].x){
                curveData.splice(i+1,1);
            }
        }
        maxX = Math.max(curveData[i].x,maxX);
        maxY = Math.max(curveData[i].y,maxY);
        minX = Math.min(curveData[i].x,minX);
        minY = Math.min(curveData[i].y,minY);
    }

    var rangeX = maxX-minX;
    var rangeY = maxY-minY;
    for(var i = 0; i < curveData.length; i ++){
        curveData[i].x = ((curveData[i].x-minX)/rangeX)*100;
        curveData[i].y = ((curveData[i].y-minY)/rangeY);
    }
    var curve = [];
    for(var i = 0; i <= 100; i ++){
        var l = 0;
        while( l < curveData.length-2 && curveData[l+1].x < i){
            l += 1;
        }
        if(l === curveData.length){
            curve.push(curveData[l].y);
        }else{
            var x = curveData[l].x;
            var x1 = curveData[l+1].x;
            var y = (i-x)/(x1-x);
            curve.push(curveData[l].y+(curveData[l+1].y-curveData[l].y)*y);
        }
    }
    this.curves.push(curve);
}
MMath.prototype.getCurve = function(index,u){
    if(index >= this.curves.length || index < 0){
        return 0;
    }
    var c = this.curves[index];
    u = mMath.clamp(u*100,0,100);
    if(u === 0){
        return c[0];
    }else
    if(u === 100){
        return c[100];
    }
    var ui = Math.floor(u);
    u = u%1;
    return c[ui]+(c[ui+1]-c[ui])*u;    
}
MMath.prototype.getCurveMix = function(index1,index2,u,mix){
    if(index2 >= this.curves.length || index2 < 0 || index1 >= this.curves.length || index1 < 0 ){
        return 0;
    }
    var c1 = this.curves[index1];
    var c2 = this.curves[index2];
    u = mMath.clamp(u*100,0,100);

    if(u === 0){
        return c1[0]+(c2[0]-c1[0])*mix;
    }else
    if(u === 100){
        return c1[100]+(c2[100]-c1[100])*mix;
    }
    var ui = Math.floor(u);
    u = u%1;
    var m1 = c1[ui]+(c2[ui]-c1[ui])*mix
    var m2 = c1[ui+1]+(c2[ui+1]-c1[ui+1])*mix
    return m1+(m2-m1)*u;    
}
MMath.prototype.getCurveCount = function(){
    if(this.curves === undefined){
        return 0;
    }
    return this.curves.length;
}
MMath.prototype.getPointOnBezierCurve = function(x1,y1,x2,y2,x3,y3,x4,y4,p){
        var xx1 = (x2-x1)*p+x1;
        var yy1 = (y2-y1)*p+y1;
        var xx2 = (x3-x2)*p+x2;
        var yy2 = (y3-y2)*p+y2;
        var xx3 = (x4-x3)*p+x3;
        var yy3 = (y4-y3)*p+y3;

        var xxA1 = (xx2-xx1)*p+xx1;
        var yyA1 = (yy2-yy1)*p+yy1;
        var xxA2 = (xx3-xx2)*p+xx2;
        var yyA2 = (yy3-yy2)*p+yy2;
        
        return {x:(xxA2-xxA1)*p+xxA1,y:(yyA2-yyA1)*p+yyA1};
} 
MMath.prototype.distance = function(x, y, xx, yy) {
   return (this.dist1 = Math.sqrt(this.distSqr1 = (Math.pow(x - xx, 2) + Math.pow(y - yy, 2))));
}
MMath.prototype.direction = function (x, y, xx, yy) {
    var angV = Math.acos((xx - x) / (this.dist1 = Math.sqrt(Math.pow(x - xx, 2) + Math.pow(y - yy, 2))));
    if (y - yy > 0) {
        return  - angV;
    }
    return angV;
}
MMath.prototype.distanceDirection = function(x, y, xx, yy) {
    // fast version with no returns
   xx = xx-x;
   yy = y-yy;
   this.dist1 = Math.sqrt(xx*xx+yy*yy);
   this.angle = Math.acos(xx / x);
   if (yy > 0) this.angle = - this.angle;
}
MMath.prototype.directionPo = function(p1,p2) {
   this.angle = Math.acos((p2.x - p1.x) / Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2)));
   if (p1.y - p2.y > 0) this.angle  = - this.angle ;
   return this.angle ;
}
MMath.prototype.distanceP = function(p, p1) {
   return Math.sqrt(Math.pow(p.x-p1.x,2) + Math.pow(p.y-p1.y,2));
}
MMath.prototype.pointOnLine = function(x, y, xx, yy,uDist) {
    return {x:x+(xx-x)*uDist,y:y+(yy-y)*uDist};
}
MMath.prototype.pointOnLineP = function(p1,p2,uDist) {
    return {x:p1.x+(p2.x-p1.x)*uDist,y:p1.y+(p2.y-p1.y)*uDist};
}
MMath.prototype.easeInOut = function (x, pow) {
	var xx = Math.pow(x,pow);
	return(xx/(xx+Math.pow(1-x,pow)))
}
MMath.prototype.normalise = function(x, y, xx, yy) {
    var dist = Math.sqrt(Math.pow(x-xx,2) + Math.pow(y-yy,2));
    if(dist > 0){
        this.pointResult.x = (x-xx)/dist;
        this.pointResult.y = (y-yy)/dist;
    }else{
        this.pointResult.x = 0;
        this.pointResult.y = 0;        
    }
    return this.pointResult;
}
MMath.prototype.makeLength = function(x, y, len) {
    var dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    if(dist > 0){
        this.pointResult.x = (x/dist)*len;
        this.pointResult.y = (y/dist)*len;
    }else{
        this.pointResult.x = len;
        this.pointResult.y = 0;        
    }
    return this.pointResult;
}
MMath.prototype.pointOnLine = function(x, y,xx,yy, len) {
    var dist = Math.sqrt(Math.pow(xx-x,2) + Math.pow(yy-y,2));
    if(dist > 0){
        this.pointResult.x = x+((xx-x)/dist)*len;
        this.pointResult.y = y+((yy-y)/dist)*len;
    }else{
        this.pointResult.x = len;
        this.pointResult.y = 0;        
    }
    return this.pointResult;
}
MMath.prototype.bump = function (x, pow) {
    return Math.pow(Math.sin(x*Math.PI),pow);
}
MMath.prototype.easeBell = function (x, pow) {
    x = x*2;
    if( x > 1){
        x = 1-(x-1);
        var xx = Math.pow(x,pow);
        return(xx/(xx+Math.pow(1-x,pow)))
    }else{
        var xx = Math.pow(x,pow);
        return(xx/(xx+Math.pow(1-x,pow)))
    }
}
MMath.prototype.easeBellFlatTop = function (x, pow) {
    x = x*3;
    
    if( x > 3){
        var xx = Math.pow(0,pow);
        return(xx/(xx+Math.pow(1,pow)))
    }else
    if( x > 2){
        x = 1-(x-2);
        var xx = Math.pow(x,pow);
        return(xx/(xx+Math.pow(1-x,pow)))
    }else
    if( x > 1){
        var xx = Math.pow(1,pow);
        return(xx/(xx+Math.pow(0,pow)))
    
    }else
    if( x >= 0){
        var xx = Math.pow(x,pow);
        return(xx/(xx+Math.pow(1-x,pow)))
    
    }else{
        var xx = Math.pow(0,pow);
        return(xx/(xx+Math.pow(1,pow)))
    }
}
MMath.prototype.easeIn = function (x, pow) {
    x /=2;
	var xx = Math.pow(x,pow);
	return (xx/(xx+Math.pow(1-x,pow)))*2;
}
MMath.prototype.rushIn = function (x, pow) {
    x = Math.min(1,Math.max(0,x));
    x = x/2+0.5;
	var xx = Math.pow(x,pow);
	return ((xx/(xx+Math.pow(1-x,pow)))-0.5)*2;
}
MMath.prototype.easeCircle = function (x){
    return 1 - Math.sqrt(1-x*x);
}
MMath.prototype.rushCircle = function (x){
    x = 1-x;
    return 1 - Math.sqrt(1-x*x);
}
MMath.prototype.circularBump = function (x){
    x = x*2-1;
    return Math.sqrt(1-x*x);
}
MMath.prototype.circularSlop = function (x){
    x = x*2-1;
    if( x < 0){
        return Math.sqrt(1-x*x)/2;
    }
    return (1-Math.sqrt(1-x*x))/2 + 0.5;
}
MMath.prototype.ease = function(p,out,inn){  // bezier start at zero end at 1 out start adjust inn end ajust
    return 3*p*(1-p)*(1-p)*out+3*Math.pow(p,2)*(1-p)*inn+Math.pow(p,3);
 }
MMath.prototype.easeCenter = function (p,pow){   // ease in middle
    p = (p* 0.9)+0.05;
    return 3*0.9*p*(1-p)*(1-p)+0.1*3*p*p*(1-p)+Math.pow(p,3);
} 
MMath.prototype.getPointOnBezierList = function(p,points){
    var len = points.length;
    if(p <= points[0].x){
        return points[0].y;
    }else
    if(p >= points[len-1].x){
        return points[len-1].y;
    }
        
    for(var i = 0; i < len; i+= 3){
        if(p >= points[i].x){
            if(p < points[i+3].x){
                var x1 = point[i].x;
                var x2 = point[i+1].x;
                var x3 = point[i+2].x;
                var x4 = point[i+3].x;
                var y1 = point[i].y;
                var y2 = point[i+1].y;
                var y3 = point[i+2].y;
                var y4 = point[i+3].y;
                p = (p-x1)/(x4-x1);
                var xx1 = (x2-x1)*p+x1;
                var yy1 = (y2-y1)*p+y1;
                var xx2 = (x3-x2)*p+x2;
                var yy2 = (y3-y2)*p+y2;
                var xx3 = (x4-x3)*p+x3;
                var yy3 = (y4-y3)*p+y3;

                var xxA1 = (xx2-xx1)*p+xx1;
                var yyA1 = (yy2-yy1)*p+yy1;
                var xxA2 = (xx3-xx2)*p+xx2;
                var yyA2 = (yy3-yy2)*p+yy2;
        
                return {x:(xxA2-xxA1)*p+xxA1,y:(yyA2-yyA1)*p+yyA1};                
            }
        }
    }
    return 0; // should not reach here
        
}
MMath.prototype.getCurveWeighted = function(x,wPos){
    wPos = 1-wPos;
    var s = wPos * x;
    var e = wPos + (1-wPos)*x;
    return s + (e-s)*x;
}
MMath.prototype.getCurveWeightedQuad = function(x,w1,w2){
    w1 = 1-w1;
    w2 = 1-w2;
    
    var s = w1 * x;
    var c = w1 + (w2-w1)*x;
    var e = w2 + (1-w2)*x;
    s = s+(c-s)*x;
    e = c+(e-c)*x;
    return s + (e-s)*x;
}
MMath.prototype.gradientLog = function(gradient,startPos,endPos,startCol,endCol,resolution,easeFunction,easePower){
    var c = startCol.numbers();
    var c1 = endCol.numbers();
    var steps = 1/resolution;
    var rs = (c1[0]-c[0])/steps;
    var gs = (c1[1]-c[1])/steps;
    var bs = (c1[2]-c[2])/steps;
    var as = (c1[3]-c[3])/steps;
    var s = (endPos-startPos)/steps;
    var r,g,b,a;
    for(var i = resolution; i <= 1-resolution; i+= resolution){
        var ease = easeFunction(i,easePower);
        pos = startPos + i*s;
        r = c[0] + Math.floor((rs*i)*ease);
        g = c[1] + Math.floor((rs*i)*ease);
        b = c[2] + Math.floor((rs*i)*ease);
        a = c[3] + (rs*i)*ease;
        gradient.addColorStop(pos,"rgba("+r+","+g+","+b+","+a+")");
    }
    
}
MMath.prototype.simplifyRDP = function(points, tolerance) {  //simplify line 
    var simplify = function(start, end) {
        var maxDist, index, i, xx , yy, dx, dy, ddx, ddy, p1, p2, p, t, dist, dist1;
        p1 = points[start];
        p2 = points[end];   
        xx = p1[0];
        yy = p1[1];
        ddx = p2[0] - xx;
        ddy = p2[1] - yy;
        dist1 = (ddx * ddx + ddy * ddy);
        
        maxDist = tolerance;
        for (var i = start + 1; i < end; i++) {
            p = points[i];
            if (ddx !== 0 || ddy !== 0) {
                t = ((p[0] - xx) * ddx + (p[1] - yy) * ddy) / dist1;
                if (t > 1) {
                    dx = p[0] - p2[0];
                    dy = p[1] - p2[1];
                } else 
                if (t > 0) {
                    dx = p[0] - (xx + ddx * t);
                    dy = p[1] - (yy + ddy * t);
                } else {
                    dx = p[0] - xx;
                    dy = p[1] - yy;
                }
            }else{
                dx = p[0] - xx;
                dy = p[1] - yy;
            }
            dist = dx * dx + dy * dy 
            if (dist > maxDist) {
                index = i;
                maxDist = dist;
            }
        }

        if (maxDist > tolerance) {
            if (index - start > 1){
                simplify(start, index);
            }
            newLine.push(points[index]);
            if (end - index > 1){
                simplify(index, end);
            }
        }
    }    
    var end = points.length - 1;
    var newLine = [points[0]];
    simplify(0, end);
    newLine.push(points[end]);
    return newLine;
}
MMath.prototype.simplifyDist = function(points, tolerance) {  // tollerance should be in units squared
    if(points.length <= 2){
        return points;
    }
    var p1,p2,newPoints,i,len,dx,dy;
    p2 = points[0];
    newPoints = [p2];
    len = points.length
    for (i = 1; i < len; i++) {
        p1 = points[i];
        dx = p1[0] - p2[0];
        dy = p1[1] - p2[1];
        if ((dx * dx + dy * dy) > tolerance) {
            newPoints.push(p1);
            p2 = p1;
        }
    }
    if (p2 !== p1){
        newPoints.push(p1);
    }
    return newPoints;
}
MMath.prototype.repairLine = function(points,tolerance,close){  // repare line removing duplicates and kpining ends
    var i, len, newPoints, dist, p1, p2;
    
    len = points.length;
    
    p1 = points[0];
    newPoints = [p1];
    for(i = 1; i < len; i++){
        p2 = points[i];
        dist = this.distance(p1[0],p1[1],p2[0],p2[1]);
        if(dist > tolerance){
            newPoints.push(p2);
        }
        p1 = p2;
    }
    if(close){
        p2 = newPoints[0];
        dist = this.distance(p1[0],p1[1],p2[0],p2[1]);
        if(dist <= tolerance){
            p1[0] = p2[0];
            p1[1] = p2[1];
        }else{
            newPoints.push([p1[0],p1[1]]);
        }         
    }         
    return newPoints;
}
MMath.prototype.smoothShape = function(points,cornerThres,amount,balance,match){  // adds bezier control points at points if lines have angle less than thres
    // points: list of points
    // cornerThres: when to smooth corners and represents the angle between to lines. 
    //     When the angle is smaller than the cornerThres then smooth.
    // amount: the distance the bezier control points move out from the end point. 
    //     It represents the preportion of the line length.
    // match: if true then the control points will be balanced.
    //     The distance away from the end point is amount of the shortest line
    // balance: 0-1 Only smooth lines with balanced line lengths. 0 lines must have
    //     equal distance. 0.5 one line must be at least half as long. 1 don care what length
    var dir1,dir2,p1,p2,p3,dist1,dist2,x,y,endP,len,tau,angle,i,newPoints,aLen,closed,bal;
    if(amount < 0.001){
        return points;
    }
    if(amount >0.5){
        amount = 0.5;
    }
    
    newPoints = [];
    aLen = points.length;
    if(aLen <= 2){  // nothing to if line too short
        for(i = 0; i < aLen; i ++){  // ensure that the points are copied          
            newPoints.push([points[i][0],points[i][0]]);
        }
        return newPoints;
    }
    balance = 1-balance;
    p1 = points[0];
    endP =points[aLen-1];
    i = 1;  // start from second poitn if line not closed
    closed = false;
    len = mMath.distance(p1[0], p1[1], endP[0], endP[1]);
    if(len < Math.SQRT2){  // end points are the same. Join them in coordinate space
        endP =  p1;
        i = 0;             // start from first point is line closed
        p1 = points[aLen-2];
        closed = true;
    }       
    for(; i < aLen-1; i++){
        p2 = points[i];
        p3 = points[i + 1];
        angle = Math.abs(this.dotAngle(p2[0] - p1[0], p2[1] - p1[1], p3[0] - p2[0], p3[1] - p2[1]));
        dist1 = mMath.dist1;
        dist2 = mMath.dist2;
        if(dist1 !== 0){
            if(dist2 === 0){
                bal =-1;
            }else{
                bal = dist1 > dist2 ? dist2 / dist1 : dist1 / dist2;
            }
            
            if( angle < cornerThres*3.14 && bal >= balance){ // bend it if angle between lines is small
                  if(match){
                      dist1 = Math.min(dist1,dist2);
                      dist2 = dist1;
                  }
                  // use the two normalized vectors along the lines to create the tangent vector
                  x = (mMath.nx1 + mMath.nx2) / 2;  
                  y = (mMath.ny1 + mMath.ny2) / 2;
                  len = Math.sqrt(x * x + y * y);  // normalise the tangent
                  if(len === 0){
                      newPoints.push([p2[0],p2[1]]);                                  
                  }else{
                      x /= len;
                      y /= len;
                      newPoints.push([  // create the new point with the new bezier control points.
                            p2[0],
                            p2[1],
                            p2[0]-x*dist1*amount,
                            p2[1]-y*dist1*amount,
                            p2[0]+x*dist2*amount,
                            p2[1]+y*dist2*amount
                      ]);
                  }
            }else{
                newPoints.push([p2[0],p2[1]]);            

            }
        }
        p1 = p2;
    }  
    if(closed){ // if closed then copy first point to last.
        p1 = [];
        for(i = 0; i < newPoints[0].length; i++){
            p1.push(newPoints[0][i]);
        }
        newPoints.push(p1);
    }else{
        newPoints.push([points[points.length-1][0],points[points.length-1][1]]);      
    }
    return newPoints;    
    
    
}
