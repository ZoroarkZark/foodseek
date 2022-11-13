export const ToggleButtonExample = ({ label }) => {
    const [status, setStatus] = React.useState('unchecked')

    const onButtonToggle = (value) => {
        setStatus(status === 'checked' ? 'unchecked' : 'checked')
    }

    return (
        <ToggleButton
            icon={() => (
                <View>
                    <Text
                        style={{
                            borderTopLeftRadius: 9,
                            borderTopRightRadius: 9,
                            borderBottomLeftRadius: 9,
                            borderBottomRightRadius: 9,
                            height: 18,
                            color: 'grey',
                        }}
                    >
                        {label}
                    </Text>
                </View>
            )}
            style={{
                borderWidth: 0.5,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                width: label.length * 12,
                height: 23,
                marginRight: 4,
            }}
            value={label}
            status={status}
            onPress={onButtonToggle}
        >
            <Text>{label}</Text>
        </ToggleButton>
    )
}

;<ScrollView
    flex={1}
    horizontal={true}
    keyboardShouldPersistTaps={'handled'}
    paddingTop={6}
    contentInset={{ top: 0, left: 10, bottom: 0, right: 10 }}
    showsHorizontalScrollIndicator={false}
>
    {filters.map((filter) => {
        return (
            <View
                style={{
                    flexDirection: 'horizontal',
                    flex: 10,
                }}
            >
                <ToggleButtonExample flex={9} label={filter.label} />
                <View flex={1}></View>
            </View>
        )
    })}
</ScrollView>
