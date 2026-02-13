"use client";
import "./skeleton.css";

export function MypageSkeleton() {
  return (
    <div className="profileCard mypageSkeleton">
      <div className="mypageSkeleton__header">
        <div className="mypageSkeleton__avatar" />
        <div className="mypageSkeleton__info">
          <div className="mypageSkeleton__line mypageSkeleton__line--title" />
          <div className="mypageSkeleton__line mypageSkeleton__line--body" />
        </div>
      </div>
      <div className="mypageSkeleton__section">
        <div className="mypageSkeleton__line mypageSkeleton__line--label" />
        <div className="mypageSkeleton__line mypageSkeleton__line--value" />
      </div>
      <div className="mypageSkeleton__section">
        <div className="mypageSkeleton__line mypageSkeleton__line--label" />
        <div className="mypageSkeleton__line mypageSkeleton__line--value" />
      </div>
      <div className="mypageSkeleton__section">
        <div className="mypageSkeleton__line mypageSkeleton__line--label" />
        <div className="mypageSkeleton__line mypageSkeleton__line--value mypageSkeleton__line--valueShort" />
      </div>
    </div>
  );
}
