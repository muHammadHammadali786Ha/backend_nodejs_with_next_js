

export const user = (req,res) =>{
    return res.json({
        message:"Hello Users"
    })
}
export const manager = (req,res) =>{
    return res.json({
        message:"Hello Managers"
    })
}
export const admin = (req,res) =>{
    return res.json({
        message:"Hello Admin"
    })
}