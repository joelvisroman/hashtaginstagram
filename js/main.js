var CLIENT_ID = "162c1db63bd44815b8198a6e8407d019";
var CLIENT_SECRET = "a6b2c0ed91a84cd5aa432b6a9d4b9c4b";
var ACESS_TOKEN = "801179321.162c1db.848a38da377e4c51962cbd3d683433ab";

var fotosQnt = 0;

function readMedia(hashtag) {
    jQuery.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.instagram.com/v1/tags/"+ hashtag +"/media/recent?client_id="+ CLIENT_ID +"&access_token="+ ACESS_TOKEN +"",
        success: function(data)  {
            jQuery.each(data.data, function(ix, foto) {
                jQuery("#instagram").append(" <figure class='grid2 thumb_instagram'> <a data-href='" + foto.link +"' data-original='"+foto.images.standard_resolution.url+"'> <img alt='"+ foto.user.full_name +"' src='" + foto.images.low_resolution.url +"' > </a> <figcaption class='cor'> <span>@"+ foto.user.full_name +"</span> </figcaption> </figure>");
            });
            jQuery("#next-instagram").attr('href', data.pagination.next_url);
            fotosQnt += data.data.length;
            organizarMedia();
        }
    });
}

function paginationMedia(url) {
    jQuery.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: url,
        success: function(data)  {
            jQuery.each(data.data, function(ix, foto) {
                jQuery("#instagram").append(" <figure class='grid2 thumb_instagram'> <a data-href='" + foto.link +"' data-original='"+foto.images.standard_resolution.url+"'> <img alt='"+ foto.user.full_name +"' src='" + foto.images.low_resolution.url +"' > </a> <figcaption class='cor'> <span>@"+ foto.user.full_name +"</span> </figcaption> </figure>");
            });
            jQuery("#next-instagram").attr('href', data.pagination.next_url);
            fotosQnt += data.data.length;
            organizarMedia();
        }
    });
}

function organizarMedia() {
    var largura = jQuery('#instagram').width();
    var linha = Math.floor(largura / 175);
    var resto = fotosQnt % linha;
    jQuery('.thumb_instagram').show();

    for (var i = 1; i <= resto; i++) {
        jQuery('.thumb_instagram:nth-last-child('+i+')').hide();
    };
}

function autoload() {
    paginationMedia(jQuery('#next-instagram').attr('href'));
    jQuery('#next-instagram').text('PRONTO');
}

// Função adaptaImagem()
// Parâmetros:
// imagem (objeto jquery com as imagens selecionadas)
// container (opcional, objeto jquery com o container selecionado)
function adaptaImagem(imagem, container) {
	var largurafinal; //largura final
	var alturafinal; //altura final
	
	//se nenhum container foi definido, usamos o objeto window
	if(container == undefined) {
		container = $(window);
	}

	var larguracontainer = container.width();
	var alturacontainer = container.height();
	 
	// removemos os atributos de largura e altura da imagem, para não atrapalhar no redimensionamento
	imagem.removeAttr("width").removeAttr("height").css({ width: "", height: "" });
	 
	var larguraimagem = imagem.width(); // largura da imagem
	var alturaimagem = imagem.height(); // altura da imagem
	
	// aqui vamos determinar o tamanho final da imagem
	if(larguraimagem > alturaimagem) {
		//imagem tipo paisagem
		//se a imagem é tipo paisagem e queremos que ela ocupe a tela inteira,
		//temos que redimensioná-la pela dimensão menor, ou seja, pela altura
		alturafinal = alturacontainer;
		largurafinal = (larguraimagem * alturacontainer)/alturaimagem;

		//se a largura redimensionada ficar menor que a da tela, fazemos o redimensionamento pela largura mesmo
		if(largurafinal < larguracontainer) {
			largurafinal = larguracontainer;
			alturafinal = (alturaimagem * largurafinal)/larguraimagem;
		}
	} else {
		//imagem tipo retrato
		//se a imagem é tipo retrato e queremos que ela ocupe a tela inteira,
		//temos que redimensioná-la pela dimensão menor, ou seja, pela largura
		largurafinal = larguracontainer;
		alturafinal = (alturaimagem * largurafinal)/larguraimagem;

		//se a altura redimensionada ficar menor que a da tela, fazemos o redimensionamento pela altura mesmo
		if(alturafinal < alturacontainer) {
			alturafinal = alturacontainer;
			largurafinal = (larguraimagem * alturafinal)/alturaimagem;
		}
	}
	imagem.height(alturafinal);
	imagem.width(largurafinal);
	 
	// aqui utilizamos um cálculo simples para determinar o posicionamento da imagem
	// para que a mesma fique no meio da tela
	// posição = dimensão da imagem/2 - dimensão do container/2
	alturafinal = imagem.height();
	var posy = (alturafinal/2 - alturacontainer/2);
	var posx = (largurafinal/2 - larguracontainer/2);
	 
	//se o cálculo das posições der resultado positivo, trocamos para negativo
	//isso é feito para que a centralização da imagem dê certo
	if(posy > 0) {
		posy *= -1;
	}
	if(posx > 0) {
		posx *= -1;
	}
	 
	//colocamos através da função css() do jquery o posicionamento da imagem
	imagem.css({'top': posy + 'px', 'left': posx + 'px'});
}

//quando a página carregar ou quando a janela for redimensionada, adaptamos a imagem
$(window).bind('resize load', function() {
	adaptaImagem($('#fundo img'));
});

jQuery(document).ready(function() {
    readMedia('osterfest');

    jQuery("#next-instagram").on('click', function(event) {
        event.preventDefault();
        paginationMedia(jQuery(this).attr('href'));
    });

    jQuery(window).resize( function() {
        organizarMedia();
    });

    jQuery('html').on('click', '.thumb_instagram a', function() {
        jQuery('#shadow-box').fadeIn('500');
        $shadowImg = jQuery(this).children('img');
        $shadowImg = $shadowImg.clone().appendTo('#shadow-box').addClass('shadow-img').hide();
        var shadowImgUrl = jQuery(this).attr('data-original');

        $shadowImg.attr('src', shadowImgUrl);

        $shadowImg.css({
            'box-sizing'    : 'border-box',
            'position'      : 'relative',
            'border-radius' : '0',
            'border'        : '10px solid #fff',
            'z-index'       : '999999999999',
            'max-width'     : '80%',
            'max-height'    : '80%',
            'top'           : '85px',
            'margin'        : '0 auto',
            'display'       : 'block'
        }).delay(500).fadeIn('500');


    });

    jQuery('#shadow-box').on('click', function() {
        jQuery('#shadow-box').fadeOut('250');
        $shadowImg.fadeOut('100').delay(100).remove();
    });

    jQuery(document).on('scroll', function(event) {
        var altura = jQuery('html').height();
        var footer = jQuery('#autoload').offset().top;
        if (footer == (altura - 100)) {
            jQuery('#next-instagram').text('Carregando...');
            setTimeout(autoload, 2000);
        }
    });
});