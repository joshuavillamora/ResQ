import { createHomeStyles } from "@/assets/styles/home.style";
import useTheme from "@/hooks/UseTheme";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type MenuProps = {
	onItemPress?: () => void;
};

const menuItems = [
	"Settings",
	"Share your location",
	"Refer to other people",
	"Rate us",
];

const Menu = ({ onItemPress }: MenuProps) => {
	const { colors } = useTheme();
	const homeStyle = createHomeStyles(colors);

	return (
		<View style={homeStyle.leftMenuContent}>
			<Text style={homeStyle.leftMenuTitle}>Menu</Text>
			{menuItems.map((item) => (
				<TouchableOpacity
					key={item}
					activeOpacity={0.8}
					onPress={onItemPress}
				>
					<Text style={homeStyle.leftMenuItemText}>{item}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default Menu;
