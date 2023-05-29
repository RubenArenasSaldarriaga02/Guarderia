const express = require('express')
const pool = require('../database')
const PDF = require('pdfkit-construct')
const router = express.Router()
const {isLoggedIn,isStudent,isTeacher,isAdmin} = require('../lib/authentication')


//RUTAS DEL ESTUDIANTE
router.get('/cursos',isLoggedIn,isStudent, async (req, res) => {
    const sql = 'SELECT grupo_asignatura_id_asig,t.*,s.nombre as nombre_asig,p.nombre FROM (estudiante_has_grupo inner join (grupo g inner join tiempo t on g.tiempo_idtiempo=t.idtiempo) on estudiante_has_grupo.grupo_idgrupo=g.idgrupo) inner join asignatura s on estudiante_has_grupo.grupo_asignatura_id_asig=s.id_asig inner join profesor p on estudiante_has_grupo.grupo_profesor_cedula=p.cedula where estudiante_has_grupo.estudiante_usuario_idusuario = ?'
    const cursos =await pool.query(sql,req.user.idusuario)
    const sql_pensum = 'select e.nombre,e.cedula,e.pensum_idpensum,p.nombre as pensum  from pensum p inner join estudiante e on p.idpensum=e.pensum_idpensum where e.usuario_idusuario = ?'
    const  pensum = await pool.query(sql_pensum,req.user.idusuario)
    res.render("links/estudiante/cursosEst",{cursos,pensum})
})

router.get('/indexest', isLoggedIn,isStudent, (req, res) => {
    console.log(req.user)
    res.render("links/estudiante/indexest")
    
})
// RUTAS DEL ADMINISTRADOR
router.get('/indexadmin', isLoggedIn,isAdmin, (req, res) => {
    res.render("links/admin/indexAdmin.hbs")
})

router.get('/admin/grupo', isLoggedIn,isAdmin, async(req, res) => {
    let sql = 'SELECT nombre,cedula FROM `profesor`'
    const profesores = await pool.query(sql)
    sql = 'SELECT nombre,id_asig FROM `asignatura`'
    const asignaturas = await pool.query(sql)

    res.render("links/admin/formgroup",{profesores,asignaturas})
})

router.post('/admin/grupo', isLoggedIn,isAdmin, async(req, res) => {
    const grupo = {
        profesor: req.body.profesor,
        asignatura: req.body.asignatura,
    }
    const tiempo = {
        dia: req.body.fecha_inicio[0]+'-'+req.body.fecha_inicio[1],
        hora_inicio: req.body.hora_inicio,
        hora_final: req.body.hora_final
    }
    let sql = "INSERT INTO `tiempo` (`idtiempo`, `dia`, `hora_inicio`, `hora_fin`) VALUES (NULL,'"+tiempo.dia+"','"+tiempo.hora_inicio+"','"+tiempo.hora_final+"');"
    const tiempos = await pool.query(sql)
    const idtiempo = await pool.query("SELECT MAX(idtiempo) as id FROM `tiempo`;")
    sql = "INSERT INTO `grupo` (`idgrupo`, `profesor_cedula`, `asignatura_id_asig`, `tiempo_idtiempo`) VALUES (NULL,'"+grupo.profesor+"','"+grupo.asignatura+"','"+idtiempo[0].id+"');"
    const grupos = await pool.query(sql)
    req.flash('success', 'Group was created');
    res.redirect('/links/adminpanel')
})


router.get('/adminpanel', isLoggedIn,isAdmin, async(req, res) => {
    let sql = 'SELECT grupo.idgrupo,asignatura.nombre,asignatura.creditos,profesor.nombre as profesor FROM `grupo` INNER JOIN `asignatura` ON asignatura_id_asig=asignatura.id_asig INNER JOIN `profesor` ON profesor.cedula=profesor_cedula;'
    const grupos = await pool.query(sql)
    res.render("links/admin/adminpanel.hbs",{grupos})
})

//PENDIENTE DE ELIMINAR
router.get('/admin/estudiante:grupo', isLoggedIn,isAdmin, (req, res) => {
    res.render('links/admin/formest')
})

router.post('/admin/estudiante:grupo', isLoggedIn,isAdmin, (req, res) => {
    res.redirect('/links/adminpanel')
})

router.get('/admin/lista:idgrupo', isLoggedIn,isAdmin,async(req, res) => {
    const grupo = req.params
    const sql = 'SELECT e.* FROM `estudiante_has_grupo` INNER JOIN `estudiante` e on estudiante_has_grupo.estudiante_cedula= e.cedula WHERE estudiante_has_grupo.grupo_idgrupo = '+ grupo.idgrupo
    const lista = await pool.query(sql)
    res.render("links/admin/listaCurso",{lista})
})

router.get('/admin/agregar:idgrupo', isLoggedIn,isAdmin,async(req, res) => {
    const sql = 'SELECT e1.nombre,e1.cedula FROM estudiante e1 WHERE NOT EXISTS (SELECT NULL FROM estudiante_has_grupo e2 WHERE e2.estudiante_cedula=e1.cedula AND e2.grupo_idgrupo=?);'
    const estudiante = await pool.query(sql,[req.params.idgrupo])
    const grupo = req.params.idgrupo
    res.render("links/admin/formest",{estudiante,grupo})
})

router.post('/admin/agregar:idgrupo', isLoggedIn,isAdmin,async(req, res) => {
    const grupo = req.params.idgrupo
    const estudiante = await pool.query('SELECT cedula,pensum_idpensum,usuario_idusuario FROM estudiante WHERE cedula = ?',[req.body.cedula])
    let sql = 'SELECT grupo.profesor_cedula,grupo.asignatura_id_asig,grupo.tiempo_idtiempo FROM grupo WHERE idgrupo='+grupo
    const profesor = await pool.query(sql)
    await pool.query('INSERT INTO `notas` (`idnotas`, `parcial`, `seguimiento`, `final`) VALUES (NULL, "", "", "");')
    const notas = await pool.query('SELECT MAX(idnotas) as id FROM `notas`;')
    sql = "INSERT INTO `estudiante_has_grupo` VALUES ('"+estudiante[0].cedula+"','"+estudiante[0].pensum_idpensum+"','"+estudiante[0].usuario_idusuario+"','"+grupo+"','"+profesor[0].profesor_cedula+"','"+profesor[0].asignatura_id_asig+"','"+profesor[0].tiempo_idtiempo+"','"+notas[0].id+"')"
    const agregar = await pool.query(sql)
    req.flash('success', 'Added successfully');
    res.redirect("/links/adminpanel")
})


//RUTAS DEL PROFESOR
router.get('/indexprofe', isLoggedIn,isTeacher,(req, res) => {
    res.render("links/profesor/indexProf")
})
router.get('/profe/cursos', isLoggedIn,isTeacher,async(req, res) => {
    const sql = 'SELECT cedula FROM `profesor` WHERE usuario_idusuario = ?'
    const cedula = await pool.query(sql,req.user.idusuario)
    const sql2 = 'SELECT idgrupo,profesor_cedula,dia,hora_inicio,hora_fin,nombre FROM `grupo` INNER JOIN `tiempo` on tiempo_idtiempo=idtiempo INNER JOIN `asignatura` on asignatura_id_asig=id_asig WHERE profesor_cedula = ?;'
    const cursos = await pool.query(sql2,cedula[0].cedula)
    res.render("links/profesor/cursoProf",{cursos})
})
router.get('/profe/lista:idgrupo', isLoggedIn,isTeacher,async(req, res) => {
    const grupo = req.params
    const sql = 'SELECT e.* FROM `estudiante_has_grupo` INNER JOIN `estudiante` e on estudiante_has_grupo.estudiante_cedula= e.cedula WHERE estudiante_has_grupo.grupo_idgrupo = '+ grupo.idgrupo
    const lista = await pool.query(sql)
    res.render("links/profesor/listaProf",{lista})
})
router.get('/profe/descargarlista:idgrupo', isLoggedIn,isTeacher,async(req, res) => {
    const grupo = req.params
    const sql = 'SELECT e.* FROM `estudiante_has_grupo` INNER JOIN `estudiante` e on estudiante_has_grupo.estudiante_cedula= e.cedula WHERE estudiante_has_grupo.grupo_idgrupo = '+ grupo.idgrupo
    const lista = await pool.query(sql)

    //SE CREA EL PDF
    let doc = new PDF({ margin: 30, size: 'A4'})
    const stream = res.writeHead(200,{
        'Content-Type' : 'aplication/pdf',
        'Content-disposition' : 'attachment;filename="lista.pdf"'
    })

    const listado = lista.map((data)=>{
        const estudiantes ={
            cedula:data.cedula,
            nombre:data.nombre,
            email:data.correo,
            pensum:data.pensum_idpensum,
            usuario:data.usuario_idusuario,
        }
        return estudiantes
    })

    if(listado.length == 0){
        doc.text('There are no students enrolled in this group')
    }else{
        //CREO EL DOCUMENTO
    doc.addTable([
        {key:'cedula',label:'cedula',aling:'left'},
        {key:'nombre',label:'nombre',aling:'left'},
        {key:'email',label:'email',aling:'left'},
        {key:'pensum',label:'pensum',aling:'left'},
        {key:'usuario',label:'user',aling:'left'},
    ],listado,{
        headBackground  : '#28a745',
        headColor: "#FFFFFF",
        border: null,
        width: "auto",
        striped: true,
        stripedColors: ["#f6f6f6", "#f6f6f6"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center'
    })

    doc.setDocumentHeader({}, () => {
        doc.lineJoin('miter')
            .rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#28a745");

        doc.fill("#FFFFFF")
            .fontSize(20)
            .text(`GROUP STUDENT LIST ${grupo.idgrupo}`, doc.header.x, doc.header.y);
    });
    doc.render()
    }

    
    
    doc.on('data',(data)=>{
        stream.write(data)
    })
    doc.on('end',()=>{stream.end()})

    doc.end()


})

module.exports = router