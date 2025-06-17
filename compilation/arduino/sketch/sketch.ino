#include <Otto.h>
Otto Otto;


#define LeftLeg 23 // left leg pin, servo[0]
#define RightLeg 22 // right leg pin, servo[1]
#define LeftFoot 33 // left foot pin, servo[2]
#define RightFoot 25 // right foot pin, servo[3]
#define Buzzer 27 //buzzer pin


void setup() {
  Otto.init(LeftLeg, RightLeg, LeftFoot, RightFoot, false, Buzzer);

    Otto.setTrims((-100),0,40,(-14));
  Otto.home();

}

void loop() {

}