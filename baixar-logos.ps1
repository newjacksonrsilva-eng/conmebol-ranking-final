$logosDir = ".\client\public\logos"

if (!(Test-Path $logosDir)) {
  New-Item -ItemType Directory -Path $logosDir -Force | Out-Null
}

$logos = @{
  "palmeiras.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/palmeiras.e2be744c.png"
  "flamengo.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/flamengo.9c5e3332.png"
  "ldu-quito.png" = "https://assets.football-logos.cc/logos/ecuador/1500x1500/liga-de-quito.b0cd4b40.png"
  "racing-club.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/racing-club.2e7a0fc0.png"
  "estudiantes.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/estudiantes-de-la-plata.c9b944dc.png"
  "sao-paulo.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/sao-paulo.84a524e3.png"
  "velez-sarsfield.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/velez-sarsfield.15cda916.png"
  "river-plate.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/river-plate.1ac01d84.png"
  "botafogo.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/botafogo.fd9f548d.png"
  "penarol.png" = "https://assets.football-logos.cc/logos/uruguay/1500x1500/penarol.fbcfdc22.png"
  "libertad.png" = "https://assets.football-logos.cc/logos/paraguay/1500x1500/libertad.e335e5a7.png"
  "atletico-nacional.png" = "https://assets.football-logos.cc/logos/colombia/1500x1500/atletico-nacional.127fca22.png"
  "independiente-del-valle.png" = "https://assets.football-logos.cc/logos/ecuador/1500x1500/independiente-del-valle.4a827b1c.png"
  "universitario.png" = "https://assets.football-logos.cc/logos/peru/1500x1500/universitario.868fa07a.png"
  "internacional.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/internacional.319b9dc2.png"
  "fortaleza.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/fortaleza.e603dd38.png"
  "boca-juniors.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/boca-juniors.009a4e59.png"
  "cerro-porteno.png" = "https://assets.football-logos.cc/logos/paraguay/1500x1500/cerro-porteno.cc8b5968.png"
  "nacional.png" = "https://assets.football-logos.cc/logos/uruguay/1500x1500/nacional.cb8b210e.png"
  "independiente-rivadavia.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/independiente-rivadavia.f8dad054.png"
  "bahia.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/bahia.406c80c7.png"
  "universidad-de-chile.png" = "https://assets.football-logos.cc/logos/chile/1500x1500/universidad-de-chile.bcafa00a.png"
  "corinthians.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/corinthians.689ec041.png"
  "bolivar.png" = "https://assets.football-logos.cc/logos/bolivia/1500x1500/bolivar.68ee342b.png"
  "rosario-central.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/rosario-central.ce18e01e.png"
  "colo-colo.png" = "https://assets.football-logos.cc/logos/chile/1500x1500/colo-colo.20795596.png"
  "alianza-lima.png" = "https://assets.football-logos.cc/logos/peru/1500x1500/alianza-lima.d8192e17.png"
  "olimpia.png" = "https://assets.football-logos.cc/logos/paraguay/1500x1500/olimpia.9f04800c.png"
  "atletico-mg.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/atletico-mineiro.481ef277.png"
  "independiente.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/independiente.fe207eca.png"
  "talleres.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/talleres.c4234929.png"
  "barcelona-sc.png" = "https://assets.football-logos.cc/logos/ecuador/1500x1500/barcelona-sc.f30b579b.png"
  "cruzeiro.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/cruzeiro.d39bf864.png"
  "argentinos-juniors.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/argeninos-juniors.3fed76dc.png"
  "lanus.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/lanus.ec7cbb2a.png"
  "the-strongest.png" = "https://assets.football-logos.cc/logos/bolivia/1500x1500/the-strongest.81140066.png"
  "sporting-cristal.png" = "https://assets.football-logos.cc/logos/peru/1500x1500/sporting-cristal.976ec8c2.png"
  "athletico-pr.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/athletico-paranaense.38705958.png"
  "coquimbo-unido.png" = "https://assets.football-logos.cc/logos/chile/1500x1500/coquimbo-unido.9d78dd7f.png"
  "gremio.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/gremio.e8c992c0.png"
  "mirassol.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/mirassol.5153c341.png"
  "universidad-catolica.png" = "https://assets.football-logos.cc/logos/chile/1500x1500/universidad-catolica.5f82b9c5.png"
  "fluminense.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/fluminense.21ef58d1.png"
  "vitoria.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/vitoria.839132be.png"
  "san-lorenzo.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/san-lorenzo-de-almagro.a0e4e931.png"
  "carabobo.png" = "https://assets.football-logos.cc/logos/venezuela/1500x1500/carabobo.9523f7a0.png"
  "huracan.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/ca-huracan.7f8adc63.png"
  "deportivo-tachira.png" = "https://assets.football-logos.cc/logos/venezuela/1500x1500/deportivo-tachira.6cd551a4.png"
  "platense.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/platense.055fcd6f.png"
  "cuiaba.png" = "https://assets.football-logos.cc/logos/brazil/1500x1500/cuiaba.b72d27d6.png"
  "tolima.png" = "https://assets.football-logos.cc/logos/colombia/1500x1500/deportes-tolima.a8229a1b.png"
  "cusco.png" = "https://assets.football-logos.cc/logos/peru/1500x1500/cusco.df4d93a9.png"
  "independiente-medellin.png" = "https://assets.football-logos.cc/logos/colombia/1500x1500/independiente-medellin.cbcaecab.png"
  "deportivo-la-guaira.png" = "https://assets.football-logos.cc/logos/venezuela/1500x1500/deportivo-la-guaira.7c49271f.png"
  "santa-fe.png" = "https://assets.football-logos.cc/logos/colombia/1500x1500/independiente-santa-fe.e7bd3b91.png"
  "junior.png" = "https://assets.football-logos.cc/logos/colombia/1500x1500/atletico-junior.02cdb256.png"
  "always-ready.png" = "https://assets.football-logos.cc/logos/bolivia/1500x1500/always-ready.d109aa21.png"
  "universidad-central.png" = "https://assets.football-logos.cc/logos/venezuela/1500x1500/universidad-central.dce028a7.png"
  "central-cordoba.png" = "https://assets.football-logos.cc/logos/argentina/1500x1500/central-cordoba.0147cdf5.png"
  "atletico-bucaramanga.png" = "https://assets.football-logos.cc/logos/colombia/1500x1500/bucaramanga.74e87b72.png"
  "san-antonio-bulo-bulo.png" = "https://assets.football-logos.cc/logos/bolivia/1500x1500/san-antonio-bulo-bulo.2a82d4f7.png"
}

foreach ($fileName in $logos.Keys) {
  $url = $logos[$fileName]
  $outFile = Join-Path $logosDir $fileName

  try {
    Write-Host "Baixando $fileName..."
    Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing
  } catch {
    Write-Host "Erro ao baixar $fileName" -ForegroundColor Red
    Write-Host $url -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "Finalizado! Logos salvas em: $logosDir" -ForegroundColor Green