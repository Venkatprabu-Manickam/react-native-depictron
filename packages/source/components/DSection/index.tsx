import React from "react";
import { StyleSheet, Text, View } from 'react-native';

interface dsectionProps {
    enabled?: boolean,
    id?: string,
    visible?: boolean,
    orientation? : string,
    width?: string,
    style?: object,
    children: any
};



const DSection = (props: dsectionProps) => {
    const {
        enabled = true,
        visible = true,
        orientation = 'vertical',
        width,
        id,
        style = {},
        children
    } = props;

    const styles = createStyle( orientation, visible, width);
    return (
        <View style={[styles.defaultStyle, style ]} pointerEvents={enabled ? "auto" : "none"}>
            {children}
        </View>
    )
};

const createStyle = (orientation, visible, width) => (
    StyleSheet.create({
        defaultStyle: {
            flexDirection : orientation === "vertical" ? 'column' : "row",
            display: visible ? "flex" : "none",
            width: width ? width : "auto"
        }
    })
);

export default DSection;