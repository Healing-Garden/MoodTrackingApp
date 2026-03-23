import React, { useState } from 'react';
import {
View,
Text,
TouchableOpacity,
ScrollView,
StyleSheet,
StatusBar,
TextInput
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

const FeedbackScreen = ({ navigation }) => {

const [activeCategory,setActiveCategory]=useState(0)

const categories=[
{label:'Feature',icon:'featured-play-list'},
{label:'Bug',icon:'bug-report'},
{label:'Content',icon:'star'}
]

return(

<View style={styles.container}>

<StatusBar barStyle="dark-content"/>

{/* HEADER */}

<View style={styles.header}>

<TouchableOpacity
style={styles.backBtn}
onPress={()=>navigation.goBack()}
>

<MaterialIcons name="arrow-back" size={22} color="#06210a"/>

</TouchableOpacity>

<Text style={styles.headerTitle}>
Give Feedback
</Text>

<View style={{width:40}}/>

</View>

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={styles.content}
>

{/* TITLE */}

<View style={styles.hero}>

<Text style={styles.heroTitle}>
We value your feedback
</Text>

<Text style={styles.heroSubtitle}>
Help us nurture this digital sanctuary.
Your thoughts help our garden grow stronger.
</Text>

</View>

{/* CATEGORY */}

<View style={styles.section}>

<Text style={styles.sectionLabel}>
SELECT CATEGORY
</Text>

<View style={styles.categoryRow}>

{categories.map((c,i)=>(

<TouchableOpacity
key={i}
onPress={()=>setActiveCategory(i)}
style={[
styles.categoryChip,
activeCategory===i && styles.categoryChipActive
]}
>

<MaterialIcons
name={c.icon}
size={20}
color={activeCategory===i?'#fff':'#276b2e'}
/>

<Text
style={[
styles.categoryText,
activeCategory===i && {color:'#fff'}
]}
>
{c.label}
</Text>

</TouchableOpacity>

))}

</View>

</View>

{/* INPUT */}

<View style={styles.section}>

<Text style={styles.sectionLabel}>
SUBJECT
</Text>

<TextInput
placeholder="e.g., New feature request"
style={styles.input}
/>

<Text style={[styles.sectionLabel,{marginTop:20}]}>
MESSAGE
</Text>

<TextInput
multiline
style={styles.textArea}
placeholder="Detailed description..."
/>

</View>

{/* INSIGHT CARD */}

<View style={styles.insightCard}>

<View style={{flex:1}}>

<Text style={styles.insightTitle}>
Feeling Inspired?
</Text>

<Text style={styles.insightText}>
Every small suggestion plants a seed for a more peaceful experience.
</Text>

</View>

<View style={styles.insightIcon}>

<MaterialIcons
name="eco"
size={28}
color="#0c6780"
/>

</View>

</View>

{/* BUTTON */}

<LinearGradient
colors={['#276b2e','#60a560']}
style={styles.submitBtn}
>

<Text style={styles.submitText}>
Send Feedback
</Text>

<MaterialIcons name="send" size={20} color="#fff"/>

</LinearGradient>

</ScrollView>

{/* BOTTOM NAV */}

<View style={styles.bottomNav}>

<TouchableOpacity style={styles.navItem}>
<MaterialIcons name="yard" size={24} color="#888"/>
</TouchableOpacity>

<TouchableOpacity style={styles.navItem}>
<MaterialIcons name="menu-book" size={24} color="#888"/>
</TouchableOpacity>

<TouchableOpacity style={styles.navItem}>
<MaterialIcons name="bar-chart" size={24} color="#888"/>
</TouchableOpacity>

<TouchableOpacity style={styles.navActive}>
<MaterialIcons name="person" size={20} color="#276b2e"/>
<Text style={styles.navActiveText}>Me</Text>
</TouchableOpacity>

</View>

</View>

)
}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:'#ebffe6'
},

header:{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
paddingHorizontal:24,
paddingTop:60,
paddingBottom:16,
backgroundColor:'rgba(255,255,255,0.9)',
borderBottomLeftRadius:40,
borderBottomRightRadius:40
},

backBtn:{
width:40,
height:40,
borderRadius:20,
justifyContent:'center',
alignItems:'center'
},

headerTitle:{
fontSize:18,
fontWeight:'700',
color:'#276b2e'
},

content:{
paddingHorizontal:24,
paddingTop:20,
paddingBottom:120
},

hero:{
marginBottom:40,
alignItems:'center'
},

heroTitle:{
fontSize:32,
fontWeight:'800',
textAlign:'center',
marginBottom:10
},

heroSubtitle:{
fontSize:16,
textAlign:'center',
color:'#40493e',
lineHeight:24
},

section:{
marginBottom:30
},

sectionLabel:{
fontSize:11,
fontWeight:'700',
letterSpacing:1.5,
color:'#276b2e',
marginBottom:12
},

categoryRow:{
flexDirection:'row',
flexWrap:'wrap'
},

categoryChip:{
flexDirection:'row',
alignItems:'center',
paddingHorizontal:24,
paddingVertical:12,
borderRadius:999,
backgroundColor:'#d0f1cc',
marginRight:10,
marginBottom:10
},

categoryChipActive:{
backgroundColor:'#276b2e'
},

categoryText:{
marginLeft:8,
fontWeight:'600',
color:'#276b2e'
},

input:{
backgroundColor:'#d0f1cc',
borderRadius:12,
paddingHorizontal:20,
paddingVertical:16
},

textArea:{
backgroundColor:'#d0f1cc',
borderRadius:12,
paddingHorizontal:20,
paddingVertical:16,
height:150,
textAlignVertical:'top'
},

insightCard:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'rgba(12,103,128,0.08)',
padding:24,
borderRadius:16,
marginTop:10
},

insightTitle:{
fontWeight:'700',
fontSize:16,
marginBottom:4
},

insightText:{
fontSize:13,
color:'#40493e'
},

insightIcon:{
width:52,
height:52,
borderRadius:26,
backgroundColor:'rgba(255,255,255,0.5)',
justifyContent:'center',
alignItems:'center'
},

submitBtn:{
flexDirection:'row',
justifyContent:'center',
alignItems:'center',
gap:10,
paddingVertical:18,
borderRadius:16,
marginTop:30
},

submitText:{
color:'#fff',
fontSize:16,
fontWeight:'700'
},

bottomNav:{
position:'absolute',
bottom:0,
left:0,
right:0,
height:90,
flexDirection:'row',
justifyContent:'space-around',
alignItems:'center',
backgroundColor:'rgba(255,255,255,0.95)',
borderTopLeftRadius:48,
borderTopRightRadius:48
},

navItem:{
alignItems:'center'
},

navActive:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'rgba(39,107,46,0.1)',
paddingHorizontal:18,
paddingVertical:8,
borderRadius:20
},

navActiveText:{
marginLeft:6,
color:'#276b2e',
fontWeight:'700'
}

})

export default FeedbackScreen