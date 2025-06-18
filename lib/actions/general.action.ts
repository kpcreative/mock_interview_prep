
import { auth, db } from "@/firebase/admin";
export async function getInterviewsByUserId(userId:string):Promise<Interview[]| null>
{
    //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
    //to current user jo cookie me save hoga usse aa jiga
    //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
    const interviews=db.collection('interviews').where('userId','==',userId).orderBy('createdAt','desc').get();//iska mtlb hai ki db me interviews nam ka collection hai usme jiska userId==cureent ka useriD se match ho rha hai usse fetch kro and createdAt time se decs order me sort krke get() kro
    //once we get the interview we can return it each interview by map
    console.log(interviews);
    return (await interviews).docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params:GetLatestInterviewsParams):Promise<Interview[]| null>
{
    //upr me jo params hai n usme userid and limit v hai ki ek bar me kitna dikahna hai single page..thodi sab dikha denge
    const {userId,limit=20}=params;

    //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
    //to current user jo cookie me save hoga usse aa jiga
    //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
    const interviews=db.collection('interviews').orderBy('createdAt','desc').where('finalized','==',true).where('userId','!=',userId).limit(limit).get();//iska mtlb hai ki db me interviews nam ka collection hai usme jiska userId==cureent ka useriD se match ho rha hai usse fetch kro and createdAt time se decs order me sort krke get() kro
    //once we get the interview we can return it each interview by map
  //  console.log(interviews);
    return (await interviews).docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];
}



//this function will allow to fetch the detail of interview...upr me jo tha vo to userid k basis pe tha ki hamne na jo user ne create kiya hai vo fetch krke laye hai db se
//and v  return kiya tha id of that interview--and interview me jo v tha

//ab ham chah rhe hai ki jab uspe click kre to ye mujhe --->id(dynamic route i.e id of that interview) pe le jaye
//to jo fetch krte tym upr na getInterviewByUserId usme hr interview ko ek id allocate hota hai vo return hga...

//and ab isme na us Id k basis pe ham usko fetch krnge
//and ab koi array return nhi krega vo ID ka particular interview hi return krega isliye retur type of promise single promise interview..

//NOte----- ab jab v koi Interview pe click krega to interview->id pe jiga..lets see kaise..

export async function getInterviewById(id:string):Promise<Interview| null>
{
    //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
    //to current user jo cookie me save hoga usse aa jiga
    //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
    const interview=db.collection('interviews').doc(id).get();

    return (await interview).data() as Interview | null;
}
