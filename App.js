import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import React, {  Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Dimensions, SafeAreaView, Text,Modal,TouchableHighlight } from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';

import ActionButton from 'react-native-action-button';
import SearchableDropdown from 'react-native-searchable-dropdown';
import MapView, {Geojson} from 'react-native-maps';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { CheckBox } from 'react-native-elements';


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalSearchVisible: false,
      modalResultsVisible: false,
      reqAddresses: [],
      dropdownContent: [],
      selectedItems: [],
      multiSliderValuePrix : [0,1000],
      multiSliderValueSurface : [0,1000],
      checkedSurface: false,
      checkedPrix: false,
    }

    this.styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#000',
      },
      mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: -1
      },
      actionButton: {
        position: 'absolute',
        width: 20,
        height: 20,
        top: 10,
        left: 10,
        // zIndex: 999,
      },
      actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white', 
      },
      modalStyle:{
        top:0,
        left:6,
        width:Dimensions.get('window').width-12,
        height:Dimensions.get('window').height-32,
        backgroundColor: 'rgba(128, 128, 128, .75)', 
        borderRadius:12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 1,  
        elevation: 5
      }
    });
  }

  async getAddressFromApi(req) {
    if (req == ""){this.setState({reqAddresses: [],dropdownContent : []})}
    try {
      let response = await fetch(
        "https://api-adresse.data.gouv.fr/search/?q="+req,
      );
      let responseJson = await response.json();
      // console.log(responseJson.features);
      if (req!=""){
        console.log('///////'+req+'////////');
        try {
          this.setState({reqAddresses: [],dropdownContent : []})
          let idx = 0;
          responseJson.features.forEach(element => {
            this.setState({
              reqAddresses: this.state.reqAddresses.concat(element),
              dropdownContent : this.state.dropdownContent.concat(
                {
                  id: idx++, 
                  name: (element["properties"]["label"]
                  +" "
                  +element["properties"]["postcode"])
                }
              )
            })
          });
          
          console.log(this.state.reqAddresses);
          // console.log(this.state.reqAddresses);
        }
        catch (error) {
          // console.error(error);
        }
      }
      // this.setState({ reqAddresses: responseJson.features });
    } catch (error) {
      console.error(error);
    }
  }

  setModalSearchVisible(visible) {
    this.setState({modalSearchVisible: visible});
  }
  setModalResultsVisible(visible) {
    this.setState({modalResultsVisible: visible});
  }

  async getResultsFromApi() {

  }
 
  
  render () 
  {
    return (
      <SafeAreaView style={this.styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <View style={this.styles.container}>
          <MapView
              initialRegion={{
                latitude: 47,
                longitude: 3,
                latitudeDelta: 1,
                longitudeDelta: 1,
              }}
              style={this.styles.mapStyle}
            />
                
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6'  title="Search" onPress={()=>{this.setModalSearchVisible(!this.state.modalSearchVisible);}}>
              <Icon name="md-search" style={this.styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Results" onPress={() => {}}>
              <Icon name="md-list" style={this.styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalSearchVisible}
            onRequestClose={() => {
            }}
            style={{
              backgroundColor: "#252525",
              opcacity:.5,
            }}> 
            <View style= {this.styles.modalStyle}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalSearchVisible(!this.state.modalSearchVisible);
                }}>
                <Text style={{left: 10, color: 'white'}}>X</Text>
              </TouchableHighlight>

              <View style={{flex:1, flexDirection:'column', justifyContent: "center", alignItems: "center"}}>
                <SearchableDropdown
                  style={{
                    zIndex: 2000, borderWidth:1, borderRadius:10, width:Dimensions.get('window').width-18,
                  }}
                    multi={true}
                    selectedItems={this.state.selectedItems}
                    onItemSelect={(item) => {
                      // const items = this.state.selectedItems;
                      // items.push(item)
                      // this.setState({ selectedItems: items });
                    }}
                    containerStyle={{ padding: 5 }}
                    onRemoveItem={(item, index) => {
                      // const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
                      // this.setState({ selectedItems: items });
                    }}
                    itemStyle={{
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#ddd',
                      borderColor: '#bbb',
                      borderWidth: 1,
                      borderRadius: 5,
                      width:Dimensions.get('window').width-26,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 3,  
                      elevation: 5
                    }}
                    itemTextStyle={{ color: '#222' }}
                    itemsContainerStyle={{
                      maxHeight: 140,
                      width:Dimensions.get('window').width-26,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 3,  
                      elevation: 5 }}
                    items={this.state.dropdownContent}
                    chip={false}
                    resetValue={false}
                    textInputProps={
                      {
                        placeholder: "Adresse",
                        underlineColorAndroid: "transparent",
                        style: {
                            padding: 12,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 5,
                            width:Dimensions.get('window').width-26,
                            backgroundColor: 'rgba(255,255,255,.95)',
                            color: 'black',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 3,  
                            elevation: 5
                        },
                        onTextChange: (text) => {this.getAddressFromApi(text);}
                      }
                    }
                    listProps={
                      {
                        nestedScrollEnabled: true,
                      }
                    }
                  />
                  <View style= {{
                    borderWidth:1,
                    borderRadius:5,
                    borderColor: '#ccc',
                    width:Dimensions.get('window').width-18,
                    backgroundColor: "rgba(255,255,255,.95)",
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 3,  
                    elevation: 5,
                    alignItems: "center"
                  }}>
                  <View style={{flexDirection:'row', alignItems:"center", justifyContent: "space-between"}}>
                    <Text>
                      Prix : {this.state.multiSliderValuePrix[0]} € à {this.state.multiSliderValuePrix[1]} € 
                    </Text>
                    <CheckBox
                      iconRight
                      containerStyle={{borderWidth:0,}}
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checked={this.state.checkedPrix}
                      onPress={() => this.setState({checkedPrix: !this.state.checkedPrix})}
                      />
                  </View>
                    <MultiSlider
                      values={[
                          this.state.multiSliderValuePrix[0],
                          this.state.multiSliderValuePrix[1],
                      ]}
                      sliderLength={Dimensions.get('window').width-32}
                      min={0}
                      max={10000}
                      step={100}
                      style={{}}
                      enabledOne
                      enabledTwo
                      onValuesChange={(values)=>{this.setState({multiSliderValuePrix: values});}}
                    />
                  </View>

                  <View style= {{
                    borderWidth:1,
                    borderRadius:5,
                    borderColor: '#ccc',
                    width:Dimensions.get('window').width-18,
                    backgroundColor: "rgba(255,255,255,.95)",
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 3,  
                    elevation: 5,
                    alignItems: "center"
                  }}>
                    <View style={{flexDirection:'row', alignItems:"center", justifyContent: "space-between"}}>
                      <Text>
                        Surface : {this.state.multiSliderValueSurface[0]} m² à {this.state.multiSliderValueSurface[1]} m² 
                      </Text>
                      <CheckBox
                        iconRight
                        containerStyle={{borderWidth:0,}}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={this.state.checkedSurface}
                        onPress={() => this.setState({checkedSurface: !this.state.checkedSurface})}
                        />
                    </View>
                    <MultiSlider
                    values={[
                        this.state.multiSliderValueSurface[0],
                        this.state.multiSliderValueSurface[1],
                    ]}
                    sliderLength={Dimensions.get('window').width-32}
                    min={0}
                    max={10000}
                    step={100}
                    style={{}}
                    enabledOne
                    enabledTwo
                    onValuesChange={(values)=>{this.setState({multiSliderValueSurface: values});}}
                  />
                  </View>
                  <CheckBox
                    iconLeft
                    title="Rechercher"
                    containerStyle={{backgroundColor: "#3498db",}}
                    textStyle={{color:"white"}}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={false}
                    onPress={() => {}}
                  />
                </View>     
              </View>
            </Modal>
        </View>
      </SafeAreaView>
    );  
  }
}


/*
https://www.myApi.com/immo?api_key=myApiKEY&prix_min=50&prix_max=0
*/