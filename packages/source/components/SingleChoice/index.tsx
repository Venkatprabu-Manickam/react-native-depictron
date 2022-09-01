import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { black, grey500, white } from "../../../config/colors";
import LabelError from "../LabelError";


interface choiceType {
    label: string,
    value: string,
    selected: boolean
};

interface Props {
    label?: string,
    error?: string,
    required?: boolean,
    choices: Array<choiceType>,
    value : string,
    onSelect : (string) => void
};

const DSigleChoiceSelect = (props: Props) => {
    const {
        label,
        error,
        required,
        choices,
        onSelect,
        value = ""
    } = props;


    const onValueChange = (selectedItem : choiceType) => {
        onSelect(selectedItem.value);
    }

    const renderChoices = (choice: choiceType, index: number) => {

        // styling
        let boderStyle = index === 0 ?
            { borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }
            : index === (choices.length - 1) ?
                { borderTopRightRadius: 3, borderBottomRightRadius: 3 } : {};
        let selected = choice.value === value;
        let selectedBg = { backgroundColor: selected  ? '#0068B3' : white };
        let selectedText = { color: selected ? white : "#89949B" };

        return (
            <TouchableOpacity 
            key={index}
            style={[styles.choiceItemContainer, boderStyle, selectedBg]} 
            onPress = {() => onValueChange(choice)}>
                <Text style={[styles.labelText, selectedText]}>{choice.label}</Text>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <LabelError
                label={label}
                error={error}
                required={required} />

            <View style={styles.choiceContainer}>
                {
                    choices.map((choice, index) => renderChoices(choice, index))
                }
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {

    },
    choiceContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    choiceItemContainer: {
        borderWidth: 1,
        borderColor: grey500,
        padding: 10,
        minHeight: 36,
        minWidth: 44,
        alignItems: 'center',
        backgroundColor: white
    },
    labelText:  {
     fontSize : 14
    }
});

export default DSigleChoiceSelect;