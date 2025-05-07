source "https://rubygems.org"

# Use GitHub Pages
gem "github-pages", group: :jekyll_plugins

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-remote-theme"
  gem "jekyll-seo-tag"
end

# Windows and JRuby does not include zoneinfo files
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
# Make WDM optional
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin], install_if: -> { RUBY_PLATFORM =~ /mingw|mswin/ && Gem::Version.new(RUBY_VERSION) < Gem::Version.new('3.3.0') }

# Required for Ruby 3.0+
gem "webrick", "~> 1.7"

# For Markdown processing
gem "kramdown-parser-gfm"