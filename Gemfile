source "https://rubygems.org"

# Jekyll version
gem "jekyll", "~> 3.9.3"

# Minima theme
gem "minima", github: "jekyll/minima", ref: "1e8a445"

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.15.1"
  gem "jekyll-remote-theme", "~> 0.4.3"
  gem "jekyll-seo-tag", "~> 2.7.1"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# kramdown v2 ships without the GFM parser by default
gem "kramdown-parser-gfm"