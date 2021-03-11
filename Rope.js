class Rope
{
    constructor(bodyA, pointB)
    {
        var options =
        {
            bodyA: bodyA,
            pointB: pointB,
            stiffness: 0.1,
        }
        this.pointB = pointB
        this.sling = Constraint.create(options);
        World.add(world, this.sling);
    }
    fly()
    {
        this.sling.bodyA = null;
    }
    attach(body, point)
    {
        this.sling.bodyA = body;
        this.sling.pointB = point;
        this.pointB = point;
    }      
    display()
    {
        if(this.sling.bodyA)
        {
            var pointA = this.sling.bodyA.position;
            var pointB = this.pointB;
            push();
            stroke("black");
            strokeWeight(2);
            line(pointA.x, pointA.y, pointB.x, pointB.y);
            pop();
        }
    }
    
}