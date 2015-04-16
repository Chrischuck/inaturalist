require "spec_helper"

describe "Logstasher" do

  it "identified bots given a user agent" do
    bots = [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
      "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26
        (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25
        (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 OpenSSL/0.9.8i",
      "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
      "NewRelicPinger/1.0 (733677)",
      "Python-urllib/2.7",
      "Ruby"
    ]
    not_bots = [
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
      "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:37.0) Gecko/20100101 Firefox/37.0",
      "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0"
    ]
    bots.each do |bot|
      puts bot
      expect( Logstasher.is_user_agent_a_bot?(bot) ).to be true
    end
    not_bots.each do |not_bot|
      expect( Logstasher.is_user_agent_a_bot?(not_bot) ).to be false
    end
  end

end
