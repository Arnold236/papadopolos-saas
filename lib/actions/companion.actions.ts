'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../dupabase";

export const createCompanion = async (formData : CreateCompanion ) => {
    const {userId: author} = await auth();
    const supabase = createSupabaseClient();

    const {data, error} =  await supabase
        .from('companions')
        .insert({...formData, author})
        .select();

    if (error || !data) {
        throw new Error(error?.message || 'failed to create a companion');
    }

    return data[0];
}

export const getAllCompanions = async ({limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const superbase = createSupabaseClient();

    let query = superbase.from( 'Companions').select();

    if (subject && topic) {
        query = query.ilike( 'subject',  `${subject}%`)
            .or( `topc.ilike.%${topic},name.ilike.%${topic}%`)
    }else if(subject){
        query = query.ilike( 'subject', `${subject}%`)
    }else if(topic){
        query = query.or(`topc.ilike.%${topic},name.ilike.%${topic}%`)
    }

    query = query.range((page -1 ) * limit, page -1);

    const {data: companions, error} = await query;

    if (error) throw new Error(error.message);

    return companions;
}

export const getCompanion = async (id: string) => {
    const superbase = createSupabaseClient();

    const {data,error } =  await superbase.from("Companions")
        .select()
        .eq( 'id', id);

        if (error) {
            return console.log(error);
            
        }
        return data[0];
}

export const addToSessionHistory = async (companionId: string) =>
{
    const {userId} = await auth();

    const superbase = createSupabaseClient();
    const {data, error} = await superbase.from('session_history')
        .insert({
            companionId: companionId,
            userId: userId
        })

    if (error) {
        throw new Error(error.message)
    }

    return data;
}


export const getRecentSessions = async (limit = 10) => {
    const superbase = createSupabaseClient();

    const {data,error } =  await superbase.from("session_hisory")
        .select(`companions: companion_id (*)`)
        .order('created_at',{ascending: false})
        .limit(limit);

        if (error) {
            return console.log(error.message);
            
        }
        return data.map(({companions}) => companions);
}

export const getUserRecentSessions = async (userId:string, limit =10) => {
    const superbase = createSupabaseClient();

    const {data,error } =  await superbase.from("session_hisory")
        .select(`companions: companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at',{ascending: false})
        .limit(limit);

        if (error) {
            return console.log(error.message);
            
        }
        return data.map(({companions}) => companions);
}

export const getUserCompanions = async (userId:string) => {
    const superbase = createSupabaseClient();

    const {data,error } =  await superbase.from("companions")
        .select()
        .eq('author', userId)

        if (error) {
            return console.log(error.message);
            
        }
        return data;
}

export const newCompanionPermissions = async () => {
    const {userId, has} = await auth();
    const superbase = createSupabaseClient();

    let limit = 0;

    if (has({plan: 'pro'})) {
        return true;
    } else if (has({feature: '10_conversations_month'})) {
        limit = 3;
    } else if (has({feature: '10_companion_limit'})) {
        limit = 10;
    }

    const {data, error} = await superbase
        .from('companions')
        .select("id",{count: 'exact'} )
        .eq("author", userId)

        if (error) throw new Error(error.message)

    const companionCount = data?.length;

    if (companionCount >= limit) {
        return false
    }else{
        return true;
    }
}