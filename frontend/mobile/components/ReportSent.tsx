import React, { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

type Props = {
  visible: boolean;
  disaster: number | null;
  onClose?: () => void;
  onMarkSafe?: () => void;
  onOpenRoute?: () => void;
  submitting?: boolean;
};

const disasterMap: Record<number, string> = {
  1: "Flood",
  2: "Earthquake",
  3: "Typhoon",
  4: "Fire",
  5: "Volcano",
  6: "Landslide",
};

const disasterTaglines: Record<number, string> = {
  1: "Expect rising water levels and limited mobility!",
  2: "Expect aftershocks and stay updated!",
  3: "Expect strong wings and flying debris!",
  4: "Smoke spreads faster than flames!",
  5: "Expect ashfall and breathing hazards!",
  6: "Watch for shifting ground and debris!",
};

const { width } = Dimensions.get("window");
const CHECKLIST_WIDTH = width * 0.85;
const ITEM_WIDTH = CHECKLIST_WIDTH - 40;

function FloodCard1() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>AVOID<Text style={{ color: "white" }}>:</Text></Text>
      <Text style={{
        textAlign: "center",
        color: "#FFF",
        fontWeight: "600",
        fontSize: 17,
        lineHeight: 26,
      }}>
        {"• Drainage canals\n• Rivers\n• Bridges\n• Flooded streets\n• Low-lying roads\n• Underpasses"}
      </Text>
    </View>
  );
}

function FloodCard2() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>OUTDOORS</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        
        {/* Left column: images + labels */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/flood1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Move to a higher area immediately
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/flood2.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Avoid flowing water
            </Text>
          </View>
        </View>

        {/* Right: warning box */}
        <View style={{
          flex: 1,
          borderColor: "#93D047",
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginLeft: 8,
          height: 175,
        }}>
          <Text style={{ color: "white", fontWeight: "600", fontSize: 12, lineHeight: 15, textAlign: "center" }}>
            <Text style={{ color: "red" }}>DO NOT</Text>
            {"\n\n• Floodwater on foot\n• Submerged roads\n• Near riverbanks\n• Low-lying areas"}
          </Text>
        </View>

      </View>
    </View>
  );
}

function FloodCard3() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>INSIDE</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        
        {/* Left column: images + labels */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/flood3.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Switch off electricity if safe
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/flood1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Move to a higher area immediately
            </Text>
          </View>
        </View>

        {/* Right: warning box */}
        <View style={{
          flex: 1,
          borderColor: "#93D047",
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginLeft: 8,
          height: 175,
        }}>
          <Text style={{ color: "white", fontWeight: "600", fontSize: 12, lineHeight: 15, textAlign: "center" }}>
            <Text style={{ color: "red" }}>DO NOT</Text>
            {"\n\n• Walk in floodwater\n• Submerged roads\n• Near riverbanks\n• Low-lying areas"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function FloodCard4() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ color: "#EEFF00", fontSize: 24, fontWeight: "700" }}>IN VEHICLE</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600", lineHeight: 21 }}>
            {"• Turn around if road is flooded\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#EEFF00", fontWeight: "700", lineHeight: 21 }}>
            {"DO NOT drive through:\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600", lineHeight: 21 }}>
            {"• Fast-moving water\n• Submerged roads\n• Overflowed bridges"}
          </Text>
        </View>
        <Image source={require('@/assets/images/flood4.png')} style={{ width: 90, height: 90 }} />
      </View>
    </View>
  );
}

function EarthquakeCard1() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>AVOID<Text style={{ color: "white" }}>:</Text></Text>
      <Text style={{
        textAlign: "center",
        color: "#FFF",
        fontWeight: "600",
        fontSize: 17,
        lineHeight: 26,
      }}>
        {"• Windows\n• Mirrors\n• Glass\n• Shelves\n• Hanging object"}
      </Text>
    </View>
  );
}

function EarthquakeCard2() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>OUTSIDE</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>

        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/earthquake1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Move away from buildings
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/earthquake2.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Call emergency responders
            </Text>
          </View>
        </View>

        <View style={{
          flex: 1,
          borderColor: "#93D047",
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginLeft: 8,
          height: 175,
        }}>
          <Text style={{ color: "white", fontWeight: "600", fontSize: 14, lineHeight: 15, textAlign: "center", justifyContent: "center" }}>
            <Text style={{ color: "red", fontWeight: "700" }}>DO NOT </Text>
            {"stay near:\n\n• Buildings\n• Streetlights\n• Power Lines \n• Bridges\n• Trees\n• Walls"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function EarthquakeCard3() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>INSIDE</Text>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image source={require('@/assets/images/earthquake3.png')} style={{ width: 250, height: 60 }} />
      </View>
      <View style={{
        borderColor: "#93D047",
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        width: 200,
        marginTop: 12,
      }}>
        <Text style={{ color: "white", fontWeight: "600", fontSize: 12, lineHeight: 12, textAlign: "center" }}>
          <Text style={{ color: "red" }}>DO NOT</Text>
          {": \n• Panic\n• Run away\n• Use elevators"}
        </Text>
      </View>
    </View>
  );
}

function EarthquakeCard4() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ color: "#EEFF00", fontSize: 24, fontWeight: "700" }}>NEAR COASTLINE</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600", lineHeight: 21 }}>
            Move to high ground immediately if shaking lasts longer than 20 seconds.
          </Text>
        </View>
        <Image source={require('@/assets/images/earthquake4.png')} style={{ width: 90, height: 90 }} />
      </View>
    </View>
  );
}

function EarthquakeCard5() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ color: "#EEFF00", fontSize: 24, fontWeight: "700" }}>WHILE DRIVING</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "500", lineHeight: 21 }}>
            {"• Pull over safely\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#EEFF00", fontWeight: "600", lineHeight: 21 }}>
            {"DO NOT stop near:\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "500", lineHeight: 21 }}>
            {"• Fast-moving water\n• Submerged roads\n• Overflowed bridges"}
          </Text>
        </View>
        <Image source={require('@/assets/images/earthquake5.png')} style={{ width: 90, height: 90 }} />
      </View>
    </View>
  );
}

function TyphoonCard1() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>AVOID<Text style={{ color: "white" }}>:</Text></Text>
      <Text style={{
        textAlign: "center",
        color: "#FFF",
        fontWeight: "600",
        fontSize: 17,
        lineHeight: 26,
      }}>
        {"• Signboards\n• Light posts\n• Glass walls\n• Construction areas\n• Coastal Zones"}
      </Text>
    </View>
  );
}

function TyphoonCard2() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>OUTDOORS</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        
        {/* Left column: images + labels */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/typhoon1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Find shelter
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/typhoon2.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Protect head from debris
            </Text>
          </View>
        </View>

        {/* Right: warning box */}
        <View style={{
          flex: 1,
          borderColor: "#93D047",
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginLeft: 8,
          height: 175,
        }}>
          <Text style={{ color: "white", fontWeight: "600", fontSize: 12, lineHeight: 15, textAlign: "center" }}>
            <Text style={{ color: "red" }}>DO NOT</Text>
            {"\n\n• Go outside during strong winds\n• Stand near windows\n• Ignore official advisories"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TyphoonCard3() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>INSIDE</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        
        {/* Left column: images + labels */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/typhoon1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Switch off electricity if safe
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/typhoon3.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: 120, fontSize: 14, color: "#FFF", fontWeight: "600", marginLeft: 20, bottom: 4 }}>
              • Move to a higher area immediately
            </Text>
          </View>
        </View>

        {/* Right: warning box */}
        <View style={{
          flex: 1,
          borderColor: "#93D047",
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginLeft: 8,
          height: 175,
        }}>
          <Text style={{ color: "white", fontWeight: "600", fontSize: 12, lineHeight: 15, textAlign: "center" }}>
            <Text style={{ color: "red" }}>DO NOT</Text>
            {"\n\n• Go outside during strong winds\n• Stand near windows\n• Ignore official advisories"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TyphoonCard4() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ color: "#EEFF00", fontSize: 24, fontWeight: "700" }}>IN VEHICLE</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600", lineHeight: 21 }}>
            {"• Turn around if road is flooded\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#EEFF00", fontWeight: "700", lineHeight: 21 }}>
            {"DO NOT drive through:\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600", lineHeight: 21 }}>
            {"• Fast-moving water\n• Submerged roads\n• Overflowed bridges"}
          </Text>
        </View>
        <Image source={require('@/assets/images/flood4.png')} style={{ width: 90, height: 90 }} />
      </View>
    </View>
  );
}

function FireCard1() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>AVOID</Text>
      <Text style={{
        textAlign: "center",
        color: "#FFF",
        marginTop: 8,
        fontWeight: "600",
        fontSize: 17,
        lineHeight: 26,
      }}>
        {"• Panic running\n• Smoke inhalation\n• Closed hot doors\n• Elevators\n• Re-entry into buildings"}
      </Text>
    </View>
  );
}

function FireCard2() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 14, color: "#FFF", fontWeight: "600" }}>OUTSIDE</Text>
      <View style={{ flexDirection: "row", gap: 40 }}>
        <View style={{ alignItems: "center" }}>
          <Image source={require('@/assets/images/fire1.png')} style={{ width: 80, height: 80 }} />
          <Text style={{ width: 100, fontSize: 14, color: "#FFF", fontWeight: "600", textAlign: "center", bottom: 8 }}>
            Move away from buildings
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image source={require('@/assets/images/fire2.png')} style={{ width: 80, height: 80 }} />
          <Text style={{ width: 100, fontSize: 14, color: "#FFF", fontWeight: "600", textAlign: "center", bottom: 8 }}>
            Call emergency responders
          </Text>
        </View>
      </View>
      <Text style={{
        borderColor: "#93D047",
        borderRadius: 8,
        borderWidth: 1,
        color: "white",
        fontWeight: "600",
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        textAlign: "center",
        lineHeight: 12,
        paddingLeft: 20,
        paddingRight: 20,
      }}>
        <Text style={{ color: "red" }}>DO NOT</Text>
        {" stay near: \n\n • Burning buildings \n • Smoke paths \n • Gas tanks \n • Electrical posts"}
      </Text>
    </View>
  );
}

function FireCard3() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 14, color: "#FFF", fontWeight: "600" }}>INSIDE</Text>
      <View style={{ flexDirection: "row", gap: 40 }}>
        <View style={{ alignItems: "center" }}>
          <Image source={require('@/assets/images/fire3.png')} style={{ width: 80, height: 80 }} />
          <Text style={{ width: 100, fontSize: 14, color: "#FFF", fontWeight: "600", textAlign: "center", bottom: 8 }}>
            Stay low (avoid smoke)
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image source={require('@/assets/images/fire4.png')} style={{ width: 80, height: 80 }} />
          <Text style={{ width: 100, fontSize: 14, color: "#FFF", fontWeight: "600", textAlign: "center", bottom: 8 }}>
            Use nearest exit
          </Text>
        </View>
      </View>
      <Text style={{
        borderColor: "#93D047",
        borderRadius: 8,
        borderWidth: 1,
        color: "white",
        fontWeight: "600",
        fontSize: 12,
        paddingHorizontal: 20,
        paddingVertical: 4,
        textAlign: "center",
        lineHeight: 12,
      }}>
        <Text style={{ color: "red" }}>DO NOT</Text>
        {" stay near: \n\n • Use elevators \n • Open hot doors \n • Go back for belongings"}
      </Text>
    </View>
  );
}

function FireCard4() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>IN VEHICLE</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 15, color: "#FFF", fontWeight: "600", flex: 1, lineHeight: 24 }}>
          {"• Stop immediately\n• Move away from other vehicles\n• Call emergency responders"}
        </Text>
        <Image source={require('@/assets/images/fire5.png')} style={{ width: 100, height: 100 }} />
      </View>
    </View>
  );
}

function FireCard5() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>IN VEHICLE</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 15, color: "#FFF", fontWeight: "600", flex: 1, lineHeight: 24 }}>
          {"• Stop immediately\n• Move away from other vehicles\n• Call emergency responders"}
        </Text>
        <Image source={require('@/assets/images/fire6.png')} style={{ width: 100, height: 100 }} />
      </View>
    </View>
  );
}

function VolcanoCard1() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>AVOID<Text style={{ color: "white" }}>:</Text></Text>
      <Text style={{
        textAlign: "center",
        color: "#FFF",
        fontWeight: "600",
        fontSize: 17,
        lineHeight: 26,
      }}>
        {"• Breathing ash\n• River valleys\n• Contaminated water sources\n• Open manholes\n• Unknown water depth"}
      </Text>
    </View>
  );
}

function VolcanoCard2() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>OUTSIDE</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/typhoon1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: ITEM_WIDTH - 40, fontSize: 14, color: "#FFF", fontWeight: "600", bottom: 4 }}>
              • Find shelter, Cover nose and mouth, and protect your eyes from ash
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/volcano1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: ITEM_WIDTH - 40, fontSize: 14, color: "#FFF", fontWeight: "600", bottom: 4 }}>
              • Move away from bodies of water immediately to avoid the <text style={{ color: "#9DFF00" }}>RISK OF LAHAR</text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function VolcanoCard3() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>INSIDE</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/volcano2.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: ITEM_WIDTH, fontSize: 16, color: "#FFF", fontWeight: "600", bottom: 4, textAlign: "center" }}>
              • Wear mask if ash enters
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/volcano3.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: ITEM_WIDTH, fontSize: 16, color: "#FFF", fontWeight: "600", bottom: 4, textAlign: "center" }}>
              • Close windows and doors
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function VolcanoCard4() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ color: "#EEFF00", fontSize: 24, fontWeight: "700" }}>WHILE DRIVING</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600", lineHeight: 21 }}>
            {"• Drive slowly if necessary\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#EEFF00", fontWeight: "700", lineHeight: 21 }}>
            {"DO NOT drive through:\n"}
          </Text>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600", lineHeight: 21 }}>
            {"• Thick Ashfall\n• Lahar channels\n• Blocked routes"}
          </Text>
        </View>
        <Image source={require('@/assets/images/volcano4.png')} style={{ width: 90, height: 90 }} />
      </View>
    </View>
  );
}

function LandslideCard1() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{
        color: "#EEFF00",
        fontSize: 24,
        fontWeight: "700",
      }}>AVOID<Text style={{ color: "white" }}>:</Text></Text>
      <Text style={{
        textAlign: "center",
        color: "#FFF",
        fontWeight: "600",
        fontSize: 17,
        lineHeight: 26,
        width: ITEM_WIDTH - 60,
      }}>
        {"• Staying near steep slopes during heavy rain\n• Ignoring warning signs (cracks, tilting trees, unusual sounds)\n• Crossing landslide areas"}
      </Text>
    </View>
  );
}

function LandslideCard2() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>OUTSIDE</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/landslide1.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: ITEM_WIDTH - 40, fontSize: 14, color: "#FFF", fontWeight: "600", bottom: 4 }}>
              • Run sideways away from the path of the landslide. Go to higher, stable ground.
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image source={require('@/assets/images/landslide2.png')} style={{ width: 60, height: 60 }} />
            <Text style={{ width: ITEM_WIDTH - 40, fontSize: 14, color: "#FFF", fontWeight: "600", bottom: 4 }}>
              • Avoid riverbanks and steep slopes and watch for falling rocks or debris.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function LandslideCard3() {
  return (
    <View style={styles.checklistcard}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }}>INSIDE</Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 12 }}>
        <View style={{ flexDirection: "column", gap: 8, alignItems: "center", justifyContent: "center" }}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Image source={require('@/assets/images/flood1.png')} style={{ width: 60, height: 60 }} />
            <Image source={require('@/assets/images/volcano3.png')} style={{ width: 60, height: 60 }} />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ width: ITEM_WIDTH - 60, fontSize: 14, color: "#FFF", fontWeight: "600", bottom: 4, textAlign: "left" }}>
              • Move to higher floors or stable areas and stay away from windows and walls facing slopes. <br/>
              • Listen for rumbling/cracking sounds, Be ready to evacuate quickly.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function LandslideCard4() {
  return (
    <View style={styles.checklistcard}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, width: "100%", marginTop: 16 }}>
        <View>
          <Text style={{ color: "#EEFF00", fontSize: 20, fontWeight: "700" }}>WHILE DRIVING</Text>
          <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600" }}>• Drive slowly{"\n"}  if necessary</Text>
        </View>
        <Image source={require('@/assets/images/earthquake5.png')} style={{ width: 90, height: 90 }} />
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16, width: "100%" }}>
        <Text style={{ fontSize: 16, color: "#EEFF00", fontWeight: "600", lineHeight: 21 }}>
          {"Don’t drive through debris or flowing mud\nIf trapped, leave the vehicle and move to higher ground"}
        </Text>
      </View>
    </View>
  );
}

const disasterCards: Record<number, (() => JSX.Element)[]> = {
  1: [FloodCard1, FloodCard2, FloodCard3, FloodCard4],
  2: [EarthquakeCard1, EarthquakeCard2, EarthquakeCard3, EarthquakeCard4, EarthquakeCard5],
  3: [TyphoonCard1, TyphoonCard2, TyphoonCard3, TyphoonCard4],
  4: [FireCard1, FireCard2, FireCard3, FireCard4, FireCard5],
  5: [VolcanoCard1, VolcanoCard2, VolcanoCard3, VolcanoCard4],
  6: [LandslideCard1, LandslideCard2, LandslideCard3, LandslideCard4],
};

export default function ReportSent({
  visible,
  disaster,
  onClose,
  onMarkSafe,
  onOpenRoute,
  submitting = false,
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const listRef = useRef<ScrollView>(null);
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      translateY.setValue(40);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, translateY, visible]);

  useEffect(() => {
    if (visible) {
      setIndex(0);
      listRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [visible]);

  const cards = disaster ? disasterCards[disaster] || [] : [];

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.overlay, { opacity: fadeAnim }]}
    >
      <BlurView intensity={50} style={StyleSheet.absoluteFill} />

      <Animated.Image
        source={require("@/assets/images/resq-logo-with-wordmark.png")}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ translateY }] }]}
        resizeMode="contain"
      />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY }] }]}
      >
        <Text style={styles.title}>
          {submitting
            ? "Sending your report..."
            : disaster
              ? `${disasterMap[disaster]} report has been sent!`
              : "Your report has been sent!"}
        </Text>

        <View style={styles.checklist}>
          <Text style={styles.procedureLabel}>
            Emergency procedures that might help your case:
          </Text>
          <Text style={styles.tagline}>
            {disaster ? disasterTaglines[disaster] : "Stay safe!"}
          </Text>

          <ScrollView
            horizontal
            ref={listRef}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={{ width: ITEM_WIDTH }}
          >
            {cards.map((Card, i) => (
              <View key={i} style={{ width: ITEM_WIDTH, alignItems: "center" }}>
                <Card />
              </View>
            ))}
          </ScrollView>

          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={() => {
                const prev = index - 1;
                if (prev >= 0) {
                  setIndex(prev);
                  listRef.current?.scrollTo({ x: prev * ITEM_WIDTH, animated: true });
                }
              }}
            >
              <Text style={styles.navArrow}>←</Text>
            </TouchableOpacity>

            <Text style={styles.navDots}>
              {cards.map((_, i) => (i === index ? "●" : "○")).join("  ")}
            </Text>

            <TouchableOpacity
              onPress={() => {
                const next = index + 1;
                if (next < cards.length) {
                  setIndex(next);
                  listRef.current?.scrollTo({ x: next * ITEM_WIDTH, animated: true });
                }
              }}
            >
              <Text style={styles.navArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={onMarkSafe ?? onClose}
          style={[styles.button, submitting && styles.buttonDisabled]}
          disabled={submitting}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.btnText}>
              {submitting ? "Please wait" : "Mark as Safe"}
            </Text>
            <Image
              source={require("@/assets/images/checkmark.png")}
              style={{ width: 27, height: 30, marginLeft: "auto", top: 4, marginRight: 4 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenRoute}
          style={[styles.button, submitting && styles.buttonDisabled]}
          disabled={submitting}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.btnText}>Open Route</Text>
            <Image
              source={require("@/assets/images/map.png")}
              style={{ width: 25, height: 26, marginLeft: "auto", top: 2, marginRight: 5 }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,51,51,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  logo: {
    width: 160,
    height: 160,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5F5F5",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  checklist: {
    width: CHECKLIST_WIDTH,
    height: 480,
    backgroundColor: "#1F2937",
    marginTop: 32,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 18,
  },
  procedureLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFB00",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  checklistcard: {
    width: ITEM_WIDTH,
    height: 250,
    borderRadius: 20,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  cardText: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  navArrow: {
    color: "white",
    fontSize: 20,
    paddingHorizontal: 8,
  },
  navDots: {
    color: "white",
    fontSize: 12,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: "#430A0A",
    padding: 10,
    margin: 4,
    borderRadius: 25,
    width: 225,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnText: {
    position: "absolute",
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 15,
    left: 0,
    right: 20,
    bottom: 8,
  },
});